import os
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()
uri = os.getenv('MONGODB_URI')

print(f"Connecting to MongoDB...")
try:
    client = MongoClient(uri)
    db = client['nestnode_db_v2']
    print("Listing collections...")
    cols = db.list_collection_names()
    print(f"Collections found: {cols}")
    print("Success!")
except Exception as e:
    print(f"CATCH: Error: {e}")
print("Script finished normally.")
