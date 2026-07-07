#!/bin/sh
set -eu

if [ "${PRISMA_DB_PUSH:-true}" = "true" ]; then
  echo "Applying Prisma schema to database with prisma db push..."
  npx prisma db push --skip-generate
else
  echo "Skipping Prisma schema application because PRISMA_DB_PUSH is not true."
fi

exec "$@"
