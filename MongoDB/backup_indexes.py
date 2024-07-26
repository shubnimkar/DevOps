from pymongo import MongoClient
import json

# Replace with your MongoDB connection string
client = MongoClient('mongodb+srv://<username>:<password>@<cluster-url>/')
db = client['yourDatabaseName']

# Export indexes
index_info = {}
for collection_name in db.list_collection_names():
    index_info[collection_name] = db[collection_name].index_information()

# Save index_info to a file
with open('indexes_backup.json', 'w') as f:
    json.dump(index_info, f, indent=4)

print("Indexes backed up successfully.")
