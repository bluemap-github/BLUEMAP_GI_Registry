from pymongo.mongo_client import MongoClient
### 배포시 변경
# uri= "mongodb://bluemap.kr:21801/"
uri= "mongodb://bluemap.kr:21805/"
# uri= "mongodb://localhost:27017/"
client = MongoClient(uri)

db = client['DB0417']
