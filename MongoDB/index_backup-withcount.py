from pymongo import MongoClient
import json

# Replace with your MongoDB connection string
client = MongoClient('mongodb+srv://<username>:<password>@<cluster-url>/')
db = client['yourDatabaseName']

# Export indexes and count total number of indexes
index_info = {}
total_indexes = 0

for collection_name in db.list_collection_names():
    collection_indexes = db[collection_name].index_information()
    index_info[collection_name] = collection_indexes
    total_indexes += len(collection_indexes)

# Save index_info to a file
with open('indexes_backup.json', 'w') as f:
    json.dump(index_info, f, indent=4)

print(f"Indexes backed up successfully. Total number of indexes: {total_indexes}")
