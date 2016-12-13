#!/bin/sh

API="http://localhost:4741"
URL_PATH="/books"
ID="585039884a0c3634fb4926b4"

curl "${API}${URL_PATH}/${ID}" \
  --include \
  --request DELETE \
  --header "Content-Type: application/json" \
  --header "Authorization: Token token=$TOKEN"

echo
