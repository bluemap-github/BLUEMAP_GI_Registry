#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
IHO Registry -> BLUEMAP GI Registry (MongoDB) one-shot ingestion script.

✅ Progress logging included:
- Page-level fetch logs
- Every N records processed logs
- Final summaries per type + totals

What it does (within what the IHO JSON exposes):
- DDR(Data Dictionary Register):
  - type=1 Feature      -> kind=S100_CD_Feature
  - type=2 Information  -> kind=S100_CD_Information
  - type=3 Attribute    -> kind=S100_CD_SimpleAttribute OR stored as kind=S100_Concept if attributeTypeName=="complex"
  - type=5 Enumeration values -> kind=S100_CD_EnumeratedValue (linked to parent SimpleAttribute via combination_FK)
  - type=6 CodeList values    -> kind=S100_CD_EnumeratedValue (linked to parent SimpleAttribute via combination_FK)

- PR(Portrayal Register):
  - type=1 Symbol    -> kind=S100_PR_Symbol
  - type=2 LineStyle -> kind=S100_PR_LineStyle
  - type=3 AreaFill  -> kind=S100_PR_AreaFill
  - type=4 Font      -> kind=S100_PR_Font

Important limitations:
- DDR complex attribute (type=4 / attributeTypeName=="complex") has no sub-attribute composition in the provided payloads,
  so this script DOES NOT create S100_CD_ComplexAttribute (your API requires subAttributes >= 1).
  Instead it stores them as kind="S100_Concept" with tags so you can convert later.
- References / ReferenceSource are NOT ingested (as requested).
- ManagementInfo is inserted once per newly-created item (proposalType="Addition", proposalStatus="Draft").

Usage:
  export MONGO_URI="mongodb://localhost:27017"
  export MONGO_DB="registry-v02"     # optional
  python iho_ingest_mongo.py --service-key bluemapServiceKey --ddr --pr --ensure-indexes

Optional:
  --dry-run         : no DB writes
  --limit N         : cap total rows fetched per type (for testing)
  --log-every N     : print progress every N processed rows (default=200)
  --no-page-logs    : disable page-level fetch logs

Requires:
  pip install pymongo requests
"""

from __future__ import annotations

import os
import sys
import argparse
import time
from datetime import datetime, timezone
from typing import Any, Dict, Iterable, List, Optional, Tuple

import requests
from pymongo import MongoClient, ReturnDocument
from bson import ObjectId


# -----------------------------
# Project collection names (from your app/db.py)
# -----------------------------
COLL_REGISTERS   = "s100_re_registers"
COLL_ITEMS       = "s100_re_register_items"
COLL_PR_ITEMS    = "s100_pr_items"
COLL_MGMT_INFO   = "s100_re_managementinfo"
COLL_COUNTERS    = "s100_re_counters"

IHO_BASE = "https://registry.iho.int/api"


def now_utc() -> datetime:
    return datetime.now(timezone.utc)


def fmt_elapsed(seconds: float) -> str:
    if seconds < 60:
        return f"{seconds:.1f}s"
    m = int(seconds // 60)
    s = seconds - (m * 60)
    return f"{m}m{s:.0f}s"


def ensure_indexes(db) -> None:
    """Best-effort indexes (safe to run repeatedly)."""
    db[COLL_REGISTERS].create_index([("name", 1)], unique=True)

    db[COLL_ITEMS].create_index([("registerId", 1), ("concept.itemIdentifier", 1)], unique=True)
    db[COLL_ITEMS].create_index([("registerId", 1), ("kind", 1)])
    db[COLL_ITEMS].create_index([("concept.name", 1)])
    db[COLL_ITEMS].create_index([("concept.itemStatus", 1)])

    db[COLL_PR_ITEMS].create_index([("registerId", 1), ("prItem.itemIdentifier", 1)], unique=True)
    db[COLL_PR_ITEMS].create_index([("registerId", 1), ("kind", 1)])
    db[COLL_PR_ITEMS].create_index([("registerId", 1), ("prItem.name", 1)])
    db[COLL_PR_ITEMS].create_index([("registerId", 1), ("prItem.itemStatus", 1)])

    db[COLL_COUNTERS].create_index([("registerId", 1), ("name", 1)], unique=True)


def get_or_create_register(db, *, name: str, content_summary: str, dry_run: bool) -> ObjectId:
    doc = db[COLL_REGISTERS].find_one({"name": name})
    if doc:
        return doc["_id"]

    reg = {
        "name": name,
        "contentSummary": content_summary,
        "createdAt": now_utc(),
        "updatedAt": now_utc(),
        "dateOfLastChange": now_utc(),
    }
    if dry_run:
        # fake ObjectId for dry-run
        return ObjectId()

    res = db[COLL_REGISTERS].insert_one(reg)
    return res.inserted_id


def next_item_identifier(db, register_id: ObjectId, *, dry_run: bool) -> str:
    """Register-scoped sequential itemIdentifier, stored as string (matches your API)."""
    if dry_run:
        return "0"

    key = {"registerId": register_id, "name": "itemIdentifier"}
    doc = db[COLL_COUNTERS].find_one_and_update(
        key,
        {"$inc": {"seq": 1}, "$setOnInsert": {"createdAt": now_utc()}},
        upsert=True,
        return_document=ReturnDocument.AFTER,
    )
    seq = (doc or {}).get("seq") or 1
    return str(seq)


def iho_fetch(*, endpoint: str, service_key: str, type_val: int, start: int, rows: int) -> Dict[str, Any]:
    url = f"{IHO_BASE}/{endpoint}"
    params = {
        "serviceKey": service_key,
        "type": str(type_val),
        "numOfRows": str(rows),
        "startNumOfRows": str(start),
    }
    r = requests.get(url, params=params, timeout=60)
    r.raise_for_status()
    return r.json()


def iter_iho_rows(
    *,
    endpoint: str,
    service_key: str,
    type_val: int,
    page_size: int,
    limit: Optional[int],
    label: str,
    page_logs: bool,
) -> Iterable[Dict[str, Any]]:
    """
    Generator over IHO pages with page-level logs.

    Stop conditions (important):
    - If the payload provides `count` (total rows), stop once start >= total.
      (Without this, some endpoints keep returning the first page even when startNumOfRows increases,
       causing an endless loop of duplicates.)
    - Also stop on empty page.
    - Stop early if --limit is reached.
    """
    start = 0
    emitted = 0
    total: Optional[int] = None
    t0 = time.time()

    while True:
        # ✅ If we already know the total, don't fetch past the end.
        if total is not None and total > 0 and start >= total:
            if page_logs:
                print(f"[FETCH] {label} type={type_val} start={start} reached total={total}, stopping. elapsed={fmt_elapsed(time.time()-t0)}")
            break

        payload = iho_fetch(endpoint=endpoint, service_key=service_key, type_val=type_val, start=start, rows=page_size)
        data = payload.get("data") or []

        if total is None:
            # Many IHO payloads include top-level "count"
            try:
                total = int(payload.get("count", 0))
            except Exception:
                total = 0

        if page_logs:
            end = min(start + page_size, total) if total else (start + len(data))
            print(f"[FETCH] {label} type={type_val} start={start} -> {end} / total={total} (pageSize={page_size}) elapsed={fmt_elapsed(time.time()-t0)}")

        if not data:
            break

        for row in data:
            yield row
            emitted += 1
            if limit is not None and emitted >= limit:
                if page_logs:
                    print(f"[FETCH] {label} type={type_val} reached limit={limit}, stopping. elapsed={fmt_elapsed(time.time()-t0)}")
                return

        start += page_size


def normalize_dd_feature_use(use_type_name: Optional[str]) -> str:
    # Your API uses: meta / geographic / thematic? (FeatureUseType is a Literal)
    # We'll map best-effort; unknown -> meta
    if not use_type_name:
        return "meta"
    s = use_type_name.strip().lower()
    if "geo" in s:
        return "geographic"
    if "thema" in s:
        return "thematic"
    if "meta" in s:
        return "meta"
    return "meta"


def normalize_value_type(attribute_type_name: Optional[str]) -> str:
    # Must match AttributeValueType in your models.py
    if not attribute_type_name:
        return "text"
    s = attribute_type_name.strip()
    # preserve exact for "S100_CodeList" and "enumeration"
    if s.lower() == "s100_codelist":
        return "S100_CodeList"
    if s.lower() == "enumeration":
        return "enumeration"
    return s.lower()  # text/real/integer/boolean/date/etc.


def build_mgmt_addition(*, note: str) -> Dict[str, Any]:
    n = now_utc()
    return {
        "proposalType": "Addition",
        "submittingOrganisation": "IHO",
        "proposedChange": note,
        "dateProposed": n,
        "proposalStatus": "Draft",
        "controlBodyNotes": [],
        "createdAt": n,
        "updatedAt": n,
    }


def upsert_dd_item(
    db,
    *,
    register_id: ObjectId,
    kind: str,
    concept: Dict[str, Any],
    typed_body: Optional[Dict[str, Any]],
    external_tag: str,
    dry_run: bool,
) -> Tuple[ObjectId, bool]:
    """
    Idempotent-ish insert:
    - If an item in this register already has concept.alias containing external_tag, update it.
    - Else create new item with new sequential itemIdentifier and a single ManagementInfo(Addition).
    Returns: (item_object_id, created_bool)
    """
    existing = db[COLL_ITEMS].find_one({"registerId": register_id, "concept.alias": external_tag})
    n = now_utc()

    if existing:
        update: Dict[str, Any] = {
            "$set": {
                "kind": kind,
                "concept": {**existing.get("concept", {}), **concept},
                "updatedAt": n,
            }
        }
        if kind != "S100_Concept" and typed_body is not None:
            update["$set"][kind] = typed_body

        if not dry_run:
            db[COLL_ITEMS].update_one({"_id": existing["_id"]}, update)

        return existing["_id"], False

    # create
    item_identifier = next_item_identifier(db, register_id, dry_run=dry_run)
    concept_doc = dict(concept)
    concept_doc["itemIdentifier"] = item_identifier

    mgmt_doc = build_mgmt_addition(note="Imported from IHO registry (Addition)")
    mgmt_ids: List[ObjectId] = []
    if not dry_run:
        mgmt_id = db[COLL_MGMT_INFO].insert_one(mgmt_doc).inserted_id
        mgmt_ids = [mgmt_id]

    doc: Dict[str, Any] = {
        "registerId": register_id,
        "kind": kind,
        "concept": concept_doc,
        "createdAt": n,
        "updatedAt": n,
        "managementInfoIds": mgmt_ids,
        "referenceIds": [],
    }
    if kind != "S100_Concept" and typed_body is not None:
        doc[kind] = typed_body

    if not dry_run:
        res = db[COLL_ITEMS].insert_one(doc)
        return res.inserted_id, True

    return ObjectId(), True


def upsert_pr_item(
    db,
    *,
    register_id: ObjectId,
    kind: str,
    pr_item: Dict[str, Any],
    kind_body: Optional[Dict[str, Any]],
    external_tag: str,
    dry_run: bool,
) -> Tuple[ObjectId, bool]:
    """
    Idempotent-ish insert for PR items using prItem.alias tag.
    """
    existing = db[COLL_PR_ITEMS].find_one({"registerId": register_id, "prItem.alias": external_tag})
    n = now_utc()

    if existing:
        update: Dict[str, Any] = {
            "$set": {
                "kind": kind,
                "prItem": {**existing.get("prItem", {}), **pr_item},
                "updatedAt": n,
            }
        }
        if kind_body is not None:
            update["$set"][kind] = kind_body

        if not dry_run:
            db[COLL_PR_ITEMS].update_one({"_id": existing["_id"]}, update)

        return existing["_id"], False

    item_identifier = next_item_identifier(db, register_id, dry_run=dry_run)
    pr_doc = dict(pr_item)
    pr_doc["itemIdentifier"] = item_identifier

    mgmt_doc = build_mgmt_addition(note="Imported from IHO registry (Addition)")
    mgmt_ids: List[ObjectId] = []
    if not dry_run:
        mgmt_id = db[COLL_MGMT_INFO].insert_one(mgmt_doc).inserted_id
        mgmt_ids = [mgmt_id]

    doc: Dict[str, Any] = {
        "registerId": register_id,
        "kind": kind,
        "prItem": pr_doc,
        "description": [],
        "createdAt": n,
        "updatedAt": n,
        "managementInfoIds": mgmt_ids,
        "referenceIds": [],
    }
    if kind_body is not None:
        doc[kind] = kind_body

    if not dry_run:
        res = db[COLL_PR_ITEMS].insert_one(doc)
        return res.inserted_id, True

    return ObjectId(), True


def ingest_ddr(
    db,
    *,
    register_id: ObjectId,
    service_key: str,
    page_size: int,
    limit: Optional[int],
    dry_run: bool,
    log_every: int,
    page_logs: bool,
) -> None:
    """
    DDR ingest:
      - type=1 Feature
      - type=2 Information
      - type=3 Attribute (SimpleAttribute or Concept placeholder for complex)
      - type=5 Enumeration values (EnumeratedValue)
      - type=6 CodeList values (EnumeratedValue)
    """
    created_total = 0
    updated_total = 0
    skipped_total = 0

    # Mapping: IHO attribute idx -> our SimpleAttribute ObjectId
    attr_idx_to_oid: Dict[int, ObjectId] = {}

    def log_progress(prefix: str, processed: int, created: int, updated: int, skipped: int, t0: float) -> None:
        if log_every <= 0:
            return
        if processed % log_every == 0:
            print(f"[{prefix}] processed={processed} created={created} updated={updated} skipped={skipped} elapsed={fmt_elapsed(time.time()-t0)}")

    # --- type=1 Feature
    t0 = time.time()
    processed = created = updated = skipped = 0
    for row in iter_iho_rows(endpoint="dataDictionary.json", service_key=service_key, type_val=1, page_size=page_size, limit=limit, label="DDR", page_logs=page_logs):
        processed += 1
        iho_idx = row.get("idx")
        tag = f"IHO:DDR:1:{iho_idx}"
        aliases = [tag]
        if row.get("alias"):
            aliases.extend([a.strip() for a in str(row["alias"]).split(",") if a.strip()])

        concept = {
            "name": row.get("name") or "",
            "definition": row.get("definition") or "",
            "camelCase": row.get("camelCase") or None,
            "remarks": row.get("remarks") or None,
            "itemStatus": str(row.get("status")) if row.get("status") is not None else None,
            "alias": aliases,
            "definitionSource": row.get("referenceSource") or None,
            "reference": row.get("reference") or None,
            "similarityToSource": row.get("similarityToSource") or None,
            "justification": row.get("justification") or None,
            "proposedChange": row.get("proposedChange") or None,
        }
        typed = {
            "featureUseType": normalize_dd_feature_use(row.get("useTypeName")),
            "distinctionIds": [],
        }

        _, is_created = upsert_dd_item(
            db, register_id=register_id, kind="S100_CD_Feature",
            concept=concept, typed_body=typed, external_tag=tag, dry_run=dry_run
        )
        if is_created:
            created += 1
        else:
            updated += 1

        log_progress("DDR type=1 Feature", processed, created, updated, skipped, t0)

    print(f"[DDR type=1 Feature] done processed={processed} created={created} updated={updated} skipped={skipped} elapsed={fmt_elapsed(time.time()-t0)}")
    created_total += created
    updated_total += updated
    skipped_total += skipped

    # --- type=2 Information
    t0 = time.time()
    processed = created = updated = skipped = 0
    for row in iter_iho_rows(endpoint="dataDictionary.json", service_key=service_key, type_val=2, page_size=page_size, limit=limit, label="DDR", page_logs=page_logs):
        processed += 1
        iho_idx = row.get("idx")
        tag = f"IHO:DDR:2:{iho_idx}"
        aliases = [tag]
        if row.get("alias"):
            aliases.extend([a.strip() for a in str(row["alias"]).split(",") if a.strip()])

        concept = {
            "name": row.get("name") or "",
            "definition": row.get("definition") or "",
            "camelCase": row.get("camelCase") or None,
            "remarks": row.get("remarks") or None,
            "itemStatus": str(row.get("status")) if row.get("status") is not None else None,
            "alias": aliases,
            "definitionSource": row.get("referenceSource") or None,
            "reference": row.get("reference") or None,
            "similarityToSource": row.get("similarityToSource") or None,
            "justification": row.get("justification") or None,
            "proposedChange": row.get("proposedChange") or None,
        }
        typed = {"distinctionIds": []}

        _, is_created = upsert_dd_item(
            db, register_id=register_id, kind="S100_CD_Information",
            concept=concept, typed_body=typed, external_tag=tag, dry_run=dry_run
        )
        if is_created:
            created += 1
        else:
            updated += 1

        log_progress("DDR type=2 Information", processed, created, updated, skipped, t0)

    print(f"[DDR type=2 Information] done processed={processed} created={created} updated={updated} skipped={skipped} elapsed={fmt_elapsed(time.time()-t0)}")
    created_total += created
    updated_total += updated
    skipped_total += skipped

    # --- type=3 Attribute (SimpleAttribute + placeholders for complex)
    t0 = time.time()
    processed = created = updated = skipped = 0
    for row in iter_iho_rows(endpoint="dataDictionary.json", service_key=service_key, type_val=3, page_size=page_size, limit=limit, label="DDR", page_logs=page_logs):
        processed += 1
        iho_idx = row.get("idx")
        attr_type_name = (row.get("attributeTypeName") or "").strip()
        tag = f"IHO:DDR:3:{iho_idx}"
        aliases = [tag]
        if row.get("alias"):
            aliases.extend([a.strip() for a in str(row["alias"]).split(",") if a.strip()])

        concept = {
            "name": row.get("name") or "",
            "definition": row.get("definition") or "",
            "camelCase": row.get("camelCase") or None,
            "remarks": row.get("remarks") or None,
            "itemStatus": str(row.get("status")) if row.get("status") is not None else None,
            "alias": aliases,
            "definitionSource": row.get("referenceSource") or None,
            "reference": row.get("reference") or None,
            "similarityToSource": row.get("similarityToSource") or None,
            "justification": row.get("justification") or None,
            "proposedChange": row.get("proposedChange") or None,
        }

        # Cannot build ComplexAttribute without subAttributes -> store as Concept placeholder
        if attr_type_name.lower() == "complex":
            concept["remarks"] = (concept.get("remarks") or "") + " [IHO complex attribute placeholder: missing subAttributes composition]"
            _, is_created = upsert_dd_item(
                db, register_id=register_id, kind="S100_Concept",
                concept=concept, typed_body=None, external_tag=tag, dry_run=dry_run
            )
            if is_created:
                created += 1
            else:
                updated += 1
            skipped += 1  # mark as skipped conversion
            log_progress("DDR type=3 Attribute", processed, created, updated, skipped, t0)
            continue

        vt = normalize_value_type(attr_type_name)
        typed = {
            "valueType": vt,
            "quantitySpecification": row.get("quantity_SPEC") or None,
            "attributeConstraints": None,  # IHO payload does not provide constraints here
        }

        oid, is_created = upsert_dd_item(
            db, register_id=register_id, kind="S100_CD_SimpleAttribute",
            concept=concept, typed_body=typed, external_tag=tag, dry_run=dry_run
        )
        if is_created:
            created += 1
        else:
            updated += 1

        # Only map new/existing SimpleAttributes
        if iho_idx is not None:
            attr_idx_to_oid[int(iho_idx)] = oid

        log_progress("DDR type=3 Attribute", processed, created, updated, skipped, t0)

    print(f"[DDR type=3 Attribute] done processed={processed} created={created} updated={updated} skipped={skipped} elapsed={fmt_elapsed(time.time()-t0)}")
    created_total += created
    updated_total += updated
    skipped_total += skipped

    # --- type=5 Enumeration values (EnumeratedValue)
    t0 = time.time()
    processed = created = updated = skipped = 0
    for row in iter_iho_rows(endpoint="dataDictionary.json", service_key=service_key, type_val=5, page_size=page_size, limit=limit, label="DDR", page_logs=page_logs):
        processed += 1
        iho_idx = row.get("idx")
        parent_idx = row.get("combination_FK")
        tag = f"IHO:DDR:5:{iho_idx}"
        aliases = [tag]
        if row.get("alias"):
            aliases.extend([a.strip() for a in str(row["alias"]).split(",") if a.strip()])

        parent_oid = attr_idx_to_oid.get(int(parent_idx)) if parent_idx is not None else None
        if parent_oid is None:
            skipped += 1
            log_progress("DDR type=5 EnumeratedValue", processed, created, updated, skipped, t0)
            continue

        concept = {
            "name": row.get("name") or "",
            "definition": row.get("definition") or "",
            "camelCase": row.get("camelCase") or None,
            "remarks": row.get("remarks") or None,
            "itemStatus": str(row.get("status")) if row.get("status") is not None else None,
            "alias": aliases,
            "definitionSource": row.get("referenceSource") or None,
            "reference": row.get("reference") or None,
            "similarityToSource": row.get("similarityToSource") or None,
            "justification": row.get("justification") or None,
            "proposedChange": row.get("proposedChange") or None,
        }
        typed = {
            "numericCode": "",  # not exposed in current payload
            "parentSimpleAttributeId": parent_oid,
        }

        _, is_created = upsert_dd_item(
            db, register_id=register_id, kind="S100_CD_EnumeratedValue",
            concept=concept, typed_body=typed, external_tag=tag, dry_run=dry_run
        )
        if is_created:
            created += 1
        else:
            updated += 1

        log_progress("DDR type=5 EnumeratedValue", processed, created, updated, skipped, t0)

    print(f"[DDR type=5 EnumeratedValue] done processed={processed} created={created} updated={updated} skipped={skipped} elapsed={fmt_elapsed(time.time()-t0)}")
    created_total += created
    updated_total += updated
    skipped_total += skipped

    # --- type=6 CodeList values (EnumeratedValue; keep provenance in tag)
    t0 = time.time()
    processed = created = updated = skipped = 0
    for row in iter_iho_rows(endpoint="dataDictionary.json", service_key=service_key, type_val=6, page_size=page_size, limit=limit, label="DDR", page_logs=page_logs):
        processed += 1
        iho_idx = row.get("idx")
        parent_idx = row.get("combination_FK")
        tag = f"IHO:DDR:6:{iho_idx}"
        aliases = [tag]
        if row.get("alias"):
            aliases.extend([a.strip() for a in str(row["alias"]).split(",") if a.strip()])

        parent_oid = attr_idx_to_oid.get(int(parent_idx)) if parent_idx is not None else None
        if parent_oid is None:
            skipped += 1
            log_progress("DDR type=6 CodeListValue", processed, created, updated, skipped, t0)
            continue

        concept = {
            "name": row.get("name") or "",
            "definition": row.get("definition") or "",
            "camelCase": row.get("camelCase") or None,
            "remarks": ((row.get("remarks") or "") + " [IHO valueSet=codelist]").strip(),
            "itemStatus": str(row.get("status")) if row.get("status") is not None else None,
            "alias": aliases,
            "definitionSource": row.get("referenceSource") or None,
            "reference": row.get("reference") or None,
            "similarityToSource": row.get("similarityToSource") or None,
            "justification": row.get("justification") or None,
            "proposedChange": row.get("proposedChange") or None,
        }
        typed = {
            "numericCode": "",
            "parentSimpleAttributeId": parent_oid,
        }

        _, is_created = upsert_dd_item(
            db, register_id=register_id, kind="S100_CD_EnumeratedValue",
            concept=concept, typed_body=typed, external_tag=tag, dry_run=dry_run
        )
        if is_created:
            created += 1
        else:
            updated += 1

        log_progress("DDR type=6 CodeListValue", processed, created, updated, skipped, t0)

    print(f"[DDR type=6 CodeListValue] done processed={processed} created={created} updated={updated} skipped={skipped} elapsed={fmt_elapsed(time.time()-t0)}")
    created_total += created
    updated_total += updated
    skipped_total += skipped

    print(f"[DDR SUMMARY] created_total={created_total} updated_total={updated_total} skipped_total={skipped_total}")


def ingest_pr(
    db,
    *,
    register_id: ObjectId,
    service_key: str,
    page_size: int,
    limit: Optional[int],
    dry_run: bool,
    log_every: int,
    page_logs: bool,
) -> None:
    created_total = 0
    updated_total = 0

    # mapping IHO pr type -> kind
    kind_map = {
        1: "S100_PR_Symbol",
        2: "S100_PR_LineStyle",
        3: "S100_PR_AreaFill",
        4: "S100_PR_Font",
    }

    for pr_type in [1, 2, 3, 4]:
        kind = kind_map[pr_type]
        processed = created = updated = 0
        t0 = time.time()

        for row in iter_iho_rows(endpoint="portrayal.json", service_key=service_key, type_val=pr_type, page_size=page_size, limit=limit, label="PR", page_logs=page_logs):
            processed += 1
            iho_item_id = row.get("itemIdentifier")
            tag = f"IHO:PR:{pr_type}:{iho_item_id}"
            aliases = [tag]

            pr_item = {
                "name": row.get("name") or "",
                "definition": row.get("definition") or "",
                "itemStatus": row.get("itemStatus") or row.get("itemStatusVal") or None,
                "alias": aliases,
                "remarks": f"[IHO itemIdentifier={iho_item_id}]",
                "camelCase": None,
                "definitionSource": None,
                "reference": None,
                "similarityToSource": None,
                "justification": None,
                "proposedChange": "Imported from IHO registry (Addition)",
            }

            # Keep raw IHO fields as kindBody for later mapping
            kind_body = dict(row)

            _, is_created = upsert_pr_item(
                db, register_id=register_id, kind=kind,
                pr_item=pr_item, kind_body=kind_body, external_tag=tag, dry_run=dry_run
            )
            if is_created:
                created += 1
            else:
                updated += 1

            if log_every > 0 and processed % log_every == 0:
                print(f"[PR type={pr_type} {kind}] processed={processed} created={created} updated={updated} elapsed={fmt_elapsed(time.time()-t0)}")

        print(f"[PR type={pr_type} {kind}] done processed={processed} created={created} updated={updated} elapsed={fmt_elapsed(time.time()-t0)}")
        created_total += created
        updated_total += updated

    print(f"[PR SUMMARY] created_total={created_total} updated_total={updated_total}")


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--mongo-uri", default=os.getenv("MONGO_URI"), help="MongoDB URI (or set MONGO_URI)")
    ap.add_argument("--mongo-db", default=os.getenv("MONGO_DB", "registry-v02"), help="MongoDB database name")
    ap.add_argument("--service-key", default=os.getenv("IHO_SERVICE_KEY", "bluemapServiceKey"), help="IHO API serviceKey")
    ap.add_argument("--page-size", type=int, default=200, help="IHO API page size (numOfRows)")
    ap.add_argument("--limit", type=int, default=None, help="Limit per type (for testing)")
    ap.add_argument("--ddr", action="store_true", help="Ingest Data Dictionary (DDR)")
    ap.add_argument("--pr", action="store_true", help="Ingest Portrayal (PR)")
    ap.add_argument("--ensure-indexes", action="store_true", help="Create indexes (safe)")
    ap.add_argument("--dry-run", action="store_true", help="Fetch/parse but do not write to DB")

    # ✅ logging options
    ap.add_argument("--log-every", type=int, default=200, help="Print progress every N processed rows (default=200). Set 0 to disable.")
    ap.add_argument("--no-page-logs", action="store_true", help="Disable page-level fetch logs")

    args = ap.parse_args()

    if not args.mongo_uri:
        print("ERROR: --mongo-uri or MONGO_URI is required", file=sys.stderr)
        sys.exit(2)

    if not args.ddr and not args.pr:
        # default: do both
        args.ddr = True
        args.pr = True

    page_logs = not args.no_page_logs

    print("=== IHO Ingestion Start ===")
    print(f"mongo_uri={args.mongo_uri}")
    print(f"mongo_db={args.mongo_db}")
    print(f"service_key={args.service_key}")
    print(f"page_size={args.page_size} limit={args.limit} dry_run={args.dry_run}")
    print(f"log_every={args.log_every} page_logs={page_logs}")
    print("===========================")

    client = MongoClient(args.mongo_uri)
    db = client[args.mongo_db]

    if args.ensure_indexes and not args.dry_run:
        print("[INDEX] Ensuring indexes...")
        ensure_indexes(db)
        print("[INDEX] Done.")

    t0 = time.time()

    if args.ddr:
        print("[DDR] Preparing register...")
        ddr_reg = get_or_create_register(
            db,
            name="IHO S-100 Data Dictionary (Imported)",
            content_summary="Imported from IHO registry.iho.int (dataDictionary.json).",
            dry_run=args.dry_run,
        )
        print(f"[DDR] registerId={ddr_reg}")
        ingest_ddr(
            db,
            register_id=ddr_reg,
            service_key=args.service_key,
            page_size=args.page_size,
            limit=args.limit,
            dry_run=args.dry_run,
            log_every=args.log_every,
            page_logs=page_logs,
        )

    if args.pr:
        print("[PR] Preparing register...")
        pr_reg = get_or_create_register(
            db,
            name="IHO S-100 Portrayal (Imported)",
            content_summary="Imported from IHO registry.iho.int (portrayal.json).",
            dry_run=args.dry_run,
        )
        print(f"[PR] registerId={pr_reg}")
        ingest_pr(
            db,
            register_id=pr_reg,
            service_key=args.service_key,
            page_size=args.page_size,
            limit=args.limit,
            dry_run=args.dry_run,
            log_every=args.log_every,
            page_logs=page_logs,
        )

    print(f"=== Done. total_elapsed={fmt_elapsed(time.time()-t0)} ===")


if __name__ == "__main__":
    main()
