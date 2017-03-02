#!/bin/sh

API="http://localhost:4741"
URL_PATH="/examples"

curl --include --request POST "${API}${URL_PATH}" \
  --header "Content-Type: application/json" \
  --header "Authorization: Token token=$TOKEN" \
  --data '{
    "example": {
      "text": "My first example text"
    }
  }'

echo
