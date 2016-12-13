#!/bin/sh

API="http://localhost:4741"
URL_PATH="/books"
TITLE="UPDATE?"
AUTHOR="UPDATE author"
PRICE="10.00"
ID="5850102ef98a31663f3040f5"

curl "${API}${URL_PATH}/${ID}" \
  --include \
  --request PATCH \
  --header "Content-Type: application/json" \
  --header "Authorization: Token token=$TOKEN" \
  --data '{
    "book": {
      "title": "'"${TITLE}"'",
      "author": "'"${AUTHOR}"'"
    }
  }'
