from pymongo.mongo_client import MongoClient
uri= "mongodb://bluemap.dev:21801/"
client = MongoClient(uri)

db = client['DB0417']