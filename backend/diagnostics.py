import os
import requests
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()

# Check MongoDB
uri = os.getenv('MONGODB_URI')
try:
    client = MongoClient(uri)
    db = client['nestnode_db_v2']
    print(f"Collections: {db.list_collection_names()}")
except Exception as e:
    print(f"MongoDB Error: {e}")

# Check API
try:
    r = requests.get('http://localhost:8000/api/properties/')
    print(f"API status: {r.status_code}")
except Exception as e:
    print(f"API Error: {e}")
