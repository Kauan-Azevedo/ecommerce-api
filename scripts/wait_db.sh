#!/bin/sh

while ! nc -z $DB_HOST $DB_PORT; do
  echo "🟡 Waiting for Postgres Database Startup ($DB_HOST $DB_PORT) ..."
  sleep 2
done

echo "✅ Postgres Database Started Successfully ($DB_HOST:$DB_PORT)"