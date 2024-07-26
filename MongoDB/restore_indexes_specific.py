restore_indexes_specific.py

from pymongo import MongoClient
import json

# Replace with your MongoDB connection string
client = MongoClient('mongodb+srv://<username>:<password>@<cluster-url>/')
db = client['yourDatabaseName']

# List of collections to restore indexes for
collections_to_restore = ['collection1', 'collection2']

# Load index_info from the file
with open('indexes_backup.json', 'r') as f:
    index_info = json.load(f)

# Recreate indexes for specified collections
for collection_name, indexes in index_info.items():
    if collection_name in collections_to_restore:
        for index_name, index_details in indexes.items():
            keys = index_details['key']
            options = {k: v for k, v in index_details.items() if k != 'key'}
            db[collection_name].create_index(keys, **options)

print("Indexes for specified collections restored successfully.")
