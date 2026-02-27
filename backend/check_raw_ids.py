import os
import pymongo
from dotenv import load_dotenv

load_dotenv('backend/.env')
uri = os.getenv('MONGODB_URI')
client = pymongo.MongoClient(uri)
db = client['nestnode_db_v2']

collections = ['api_user', 'api_property']

for coll_name in collections:
    print(f"\nChecking collection: {coll_name}")
    coll = db[coll_name]
    for doc in coll.find().limit(5):
        _id = doc.get('_id')
        print(f"ID: {_id}, Type: {type(_id)}")
