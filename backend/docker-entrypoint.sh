#!/bin/sh
set -eu

if [ "${PRISMA_DB_PUSH:-true}" = "true" ]; then
  echo "Applying Prisma schema to database with prisma db push..."
  PRISMA_DB_PUSH_ARGS="--skip-generate"
  if [ "${PRISMA_DB_PUSH_ACCEPT_DATA_LOSS:-false}" = "true" ]; then
    echo "Allowing Prisma db push data loss warnings because PRISMA_DB_PUSH_ACCEPT_DATA_LOSS=true."
    PRISMA_DB_PUSH_ARGS="$PRISMA_DB_PUSH_ARGS --accept-data-loss"
  fi
  npx prisma db push $PRISMA_DB_PUSH_ARGS
else
  echo "Skipping Prisma schema application because PRISMA_DB_PUSH is not true."
fi

exec "$@"
