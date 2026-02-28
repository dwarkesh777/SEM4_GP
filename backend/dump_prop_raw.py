import os
import pymongo
from dotenv import load_dotenv

load_dotenv('.env')
uri = os.getenv('MONGODB_URI')
client = pymongo.MongoClient(uri)
db = client['nestnode_db_v2']
coll = db['api_property']

print("Dumping first property record:")
doc = coll.find_one()
if doc:
    for k, v in doc.items():
        print(f"{k}: {v} (Type: {type(v)})")
else:
    print("No documents found in api_property")
