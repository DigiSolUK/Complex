#!/bin/bash

OLD_DB_HOST="ep-lively-waterfall-a5oyebzi.us-east-2.aws.neon.tech"
OLD_DB_NAME="neondb"
OLD_DB_USER="neondb_owner"
OLD_DB_PORT="5432"
OLD_DB_PASSWORD="npg_IqHBOMix13Lt"

PGPASSWORD=$OLD_DB_PASSWORD pg_dump "postgresql://$OLD_DB_USER:$OLD_DB_PASSWORD@$OLD_DB_HOST:$OLD_DB_PORT/$OLD_DB_NAME?sslmode=require" -F c -b -v -f dump.sql