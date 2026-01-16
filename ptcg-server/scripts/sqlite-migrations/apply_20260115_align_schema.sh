#!/usr/bin/env bash
set -euo pipefail

DB_PATH="${1:-/Users/joemyerscough/ptcg-elite/ptcg-server/database.sq3}"
BASE_SQL="/Users/joemyerscough/ptcg-elite/ptcg-server/scripts/sqlite-migrations/20260115_align_schema.sql"

sqlite3 "$DB_PATH" ".read $BASE_SQL"

has_column() {
  local table_name="$1"
  local column_name="$2"
  local result
  result="$(sqlite3 "$DB_PATH" "SELECT 1 FROM pragma_table_info('$table_name') WHERE name = '$column_name' LIMIT 1;")"
  [[ -n "$result" ]]
}

add_column() {
  local table_name="$1"
  local column_name="$2"
  local column_def="$3"
  if ! has_column "$table_name" "$column_name"; then
    sqlite3 "$DB_PATH" "ALTER TABLE \"$table_name\" ADD COLUMN \"$column_name\" $column_def;"
  fi
}

add_column "user" "cardImagesJsonUrl" "TEXT"
add_column "user" "nightlyImagesJsonUrl" "TEXT"

add_column "match" "player1Archetype" "TEXT"
add_column "match" "player2Archetype" "TEXT"
add_column "match" "player1DeckName" "TEXT"
add_column "match" "player2DeckName" "TEXT"
add_column "match" "player1DeckId" "INTEGER"
add_column "match" "player2DeckId" "INTEGER"
add_column "match" "player1Archetype2" "TEXT"
add_column "match" "player2Archetype2" "TEXT"
