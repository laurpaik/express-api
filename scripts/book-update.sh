#!/bin/sh

API="http://localhost:4741"
URL_PATH="/books"
TITLE="UPDATE"

curl "${API}${URL_PATH}/${ID}" \
  --include \
  --request PATCH \
  --header "Content-Type: application/json" \
  --header "Authorization: Token token=${TOKEN}" \
  --data '{
      "book": {
        "title": "'"${TITLE}"'"
      }
    }'

echo
