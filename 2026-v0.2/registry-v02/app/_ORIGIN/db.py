# app/db.py
import os

from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
from fastapi import FastAPI

MONGO_URI = os.getenv("MONGO_URI")
MONGO_DB = os.getenv("MONGO_DB", "registry-v02")

# ✅ 컬렉션 이름은 코드에서 고정 추천 (MVP에서 안정적)
COLL_REGISTERS = "s100_re_registers"
COLL_ITEMS = "s100_re_register_items"
COLL_REF_SOURCES = "s100_re_referencesources"
COLL_REFERENCES = "s100_re_references"
COLL_MGMT_INFO = "s100_re_managementinfo"

# ✅ itemIdentifier 시퀀스 관리
COLL_COUNTERS = "s100_re_counters"

_client: AsyncIOMotorClient | None = None


def get_client() -> AsyncIOMotorClient:
    assert _client is not None, "Mongo client is not initialized"
    return _client


def get_db() -> AsyncIOMotorDatabase:
    return get_client()[MONGO_DB]


async def init_indexes(db: AsyncIOMotorDatabase) -> None:
    # ✅ register name unique (원하면 version 같이)
    await db[COLL_REGISTERS].create_index([("name", 1)], unique=True)

    # ✅ (registerId, concept.itemIdentifier) unique
    await db[COLL_ITEMS].create_index([("registerId", 1), ("concept.itemIdentifier", 1)], unique=True)
    await db[COLL_ITEMS].create_index([("registerId", 1), ("kind", 1)])
    await db[COLL_ITEMS].create_index([("concept.name", 1)])
    await db[COLL_ITEMS].create_index([("concept.itemStatus", 1)])

    # ✅ counters: (registerId, name) unique
    await db[COLL_COUNTERS].create_index([("registerId", 1), ("name", 1)], unique=True)

    # ✅ referencesources name unique (MVP: name 기준)
    await db[COLL_REF_SOURCES].create_index([("name", 1)], unique=True)

    # ✅ references: title index (검색용)
    await db[COLL_REFERENCES].create_index([("title", 1)])

    # ✅ managementinfo: note/search용 인덱스 정도만
    await db[COLL_MGMT_INFO].create_index([("note", 1)])


def attach_db(app: FastAPI) -> None:
    """
    main.py에서 attach_db(app) 호출하면,
    앱 startup/shutdown 때 Mongo 연결을 붙임
    """
    @app.on_event("startup")
    async def _startup() -> None:
        global _client
        if not MONGO_URI:
            raise RuntimeError("MONGO_URI is required")
        _client = AsyncIOMotorClient(MONGO_URI)
        db = get_db()
        await init_indexes(db)

    @app.on_event("shutdown")
    async def _shutdown() -> None:
        global _client
        if _client is not None:
            _client.close()
            _client = None
