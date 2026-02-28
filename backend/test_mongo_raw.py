import os
import pymongo
from dotenv import load_dotenv

load_dotenv('.env')
uri = os.getenv('MONGODB_URI')
print(f"Connecting to: {uri[:20]}...")
try:
    client = pymongo.MongoClient(uri, serverSelectionTimeoutMS=5000)
    db = client['nestnode_db_v2']
    colls = db.list_collection_names()
    print(f"Collections: {colls}")
except Exception as e:
    print(f"Error: {e}")
