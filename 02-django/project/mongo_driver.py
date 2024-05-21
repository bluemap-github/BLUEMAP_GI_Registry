from pymongo.mongo_client import MongoClient
# uri = "mongodb://localhost:27017"
# client = MongoClient(uri)


uri = "mongodb+srv://8x15yz:oQXc3PY0GQjp9TYA@cluster0.d90himj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
client = MongoClient(uri)

db = client['DB0417']