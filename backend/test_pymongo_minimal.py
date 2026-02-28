import os
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()
uri = os.getenv('MONGODB_URI')

print(f"Connecting to MongoDB...")
try:
    client = MongoClient(uri)
    # The crash usually happens when we actually try to communicate
    print("Getting database...")
    db = client.get_database()
    print("Listing collections...")
    print(db.list_collection_names())
    print("Success!")
except Exception as e:
    print(f"Error: {e}")
