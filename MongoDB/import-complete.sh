#!/bin/bash

# MongoDB Atlas connection parameters
ATLAS_URI="mongodb+srv://username:password0@cluster.mongodb.net/"
DB_NAME="name-of-database"  # Replace with your database name

# Path to the backup directory (adjust the date to match the backup you want to restore)
BACKUP_DIR="./name_of_folder-backup-dump_YYYYMMDD"

# Ensure the backup directory exists
if [ ! -d "$BACKUP_DIR" ]; then
  echo "Backup directory $BACKUP_DIR does not exist."
  exit 1
fi

# Drop all existing collections in the database
echo "Dropping all collections in the database $DB_NAME..."
mongosh --quiet --eval "
use('$DB_NAME');
var collections = db.getCollectionNames();
collections.forEach(function(collection) {
    db[collection].drop();
});
" "$ATLAS_URI"

echo "All collections dropped."

# Loop through each JSON file in the backup directory and restore
for json_file in "$BACKUP_DIR"/*.json
do
    collection=$(basename "$json_file" .json)
    echo "Restoring collection: $collection"
    mongoimport --uri "$ATLAS_URI" --db "$DB_NAME" --collection "$collection" --file "$json_file"
done

echo "MongoDB restore completed."
