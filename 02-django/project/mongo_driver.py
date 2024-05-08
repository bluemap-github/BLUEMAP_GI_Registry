from pymongo.mongo_client import MongoClient
# uri = "mongodb://localhost:27017"
# client = MongoClient(uri)


from pymongo.server_api import ServerApi
uri = "mongodb+srv://8x15yz:3oy7ZidGDO39rJJ6@cluster0.fn195xn.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

client = MongoClient(uri)

db = client['DB0417']