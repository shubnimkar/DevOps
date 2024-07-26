backup_indexes_specific.py

from pymongo import MongoClient
import json

# Replace with your MongoDB connection string
client = MongoClient('mongodb+srv://<username>:<password>@<cluster-url>/')
db = client['yourDatabaseName']

# List of collections to back up
collections_to_backup = ['collection1', 'collection2']

index_info = {}
for collection_name in collections_to_backup:
    if collection_name in db.list_collection_names():
        index_info[collection_name] = db[collection_name].index_information()

# Save index_info to a file
with open('indexes_backup.json', 'w') as f:
    json.dump(index_info, f, indent=4)

print("Indexes for specified collections backed up successfully.")
