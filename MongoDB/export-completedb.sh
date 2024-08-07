#!/bin/bash

# MongoDB Atlas connection parameters
ATLAS_URI="mongodb+srv://username:password0@cluster.mongodb.net/"
DB_NAME="name-of-database"  # Replace with your database name

# Create a date-stamped directory
DATE=$(date +%Y%m%d)
OUTPUT_DIR="./name_of_folder-backup-dump_$DATE"

# Ensure the output directory exists
mkdir -p "$OUTPUT_DIR"

# Fetch all collections in the database using mongosh
collections=$(mongosh --quiet --eval "use('$DB_NAME'); db.getCollectionNames().join(',')" "$ATLAS_URI" | tr ',' ' ')

# Loop through collections and perform mongoexport on each
for collection in $collections
do
    echo "Exporting collection: $collection"
    mongoexport --uri "$ATLAS_URI" --db "$DB_NAME" --collection "$collection" --out "$OUTPUT_DIR/$collection.json"
done

echo "MongoDB export completed."
