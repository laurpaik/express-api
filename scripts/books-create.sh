#!/bin/sh

API="http://localhost:4741"
URL_PATH="/books"
TITLE="Another awesome book"
AUTHOR="Rachel"
PRICE="1.00"
TOKEN="0VJoOZMvSJuE+n0xIG1BSw6ylyBVYVRcSJX9etY9Itc=--VLg+tsQgYviCizM1IQlsKzTE11gzyMmG7iXsOOJuTkA="

curl "${API}${URL_PATH}" \
  --include \
  --request POST \
  --header "Content-Type: application/json" \
  --header "Authorization: Token token=$TOKEN" \
  --data '{
    "book": {
      "title": "'"${TITLE}"'",
      "author": "'"${AUTHOR}"'",
      "price": "'"${PRICE}"'"
    }
  }'
