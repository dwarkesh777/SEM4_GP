import os
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()

uri = os.getenv('MONGODB_URI')
client = MongoClient(uri)
db = client['nestnode_db_v2']

print(f"Connecting to: {uri}")
print(f"Collections: {db.list_collection_names()}")
