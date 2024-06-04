from pymongo.mongo_client import MongoClient
# uri = "mongodb://localhost:27017"
# client = MongoClient(uri)


uri = "mongodb+srv://8x15yz:oQXc3PY0GQjp9TYA@cluster0.d90himj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
# uri= "mongodb://8x15yz:oQXc3PY0GQjp9TYA@127.0.0.1:27017"
# uri= "mongodb://bluemap.dev:21801"
client = MongoClient(uri)

db = client['DB0417']