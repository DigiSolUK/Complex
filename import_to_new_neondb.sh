#!/bin/bash

# New NeonDB credentials (unpooled for schema operations)
NEW_DB_HOST="ep-tiny-violet-abaevxwk.eu-west-2.aws.neon.tech"
NEW_DB_NAME="neondb"
NEW_DB_USER="neondb_owner"
NEW_DB_PORT="5432"
NEW_DB_PASSWORD="npg_ckbwiy8IVC6o"

# Restore DB from dump.sql
PGPASSWORD=$NEW_DB_PASSWORD pg_restore -h $NEW_DB_HOST -U $NEW_DB_USER -p $NEW_DB_PORT -d $NEW_DB_NAME -v dump.sql