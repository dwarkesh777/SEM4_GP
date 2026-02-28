import os
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()

uri = os.getenv('MONGODB_URI')
print(f"Attempting to connect to: {uri}")

try:
    client = MongoClient(uri, serverSelectionTimeoutMS=5000)
    # The next line might crash if it's a driver issue
    print(f"Collections: {client.nestnode_db_v2.list_collection_names()}")
    print("PyMongo connection successful")
except Exception as e:
    print(f"PyMongo error: {e}")
finally:
    client.close()
