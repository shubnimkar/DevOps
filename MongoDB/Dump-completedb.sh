#!/bin/bash

# MongoDB Atlas connection parameters
ATLAS_URI="mongodb+srv://username:password0@cluster.mongodb.net/"
DB_NAME="name-of-database"  # Replace with your database name

# Create a date-stamped directory
DATE=$(date +%Y%m%d)
OUTPUT_DIR="./name_of_folder-backup-dump_$DATE"

# Ensure the output directory exists
mkdir -p "$OUTPUT_DIR"

# Perform mongodump for the entire database
echo "Dumping entire database: $DB_NAME"
mongodump --uri "$ATLAS_URI" --db "$DB_NAME" --out "$OUTPUT_DIR"

echo "MongoDB dump completed."
