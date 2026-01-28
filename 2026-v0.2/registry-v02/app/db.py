# app/db.py
import os
from motor.motor_asyncio import AsyncIOMotorClient

_MONGO_URI = os.getenv("MONGO_URI")
_MONGO_DB  = os.getenv("MONGO_DB", "registry-v02")
_ATT_COL = os.getenv("MONGO_COL", "attributes")

_client = AsyncIOMotorClient(_MONGO_URI)
_db = _client[_MONGO_DB]

async def get_assets_collection():
    return _db[_ATT_COL]