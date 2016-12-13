#!/bin/sh

API="http://localhost:4741"
URL_PATH="/examples"
TEXT="Is this working?"
TOKEN="1mufocpqvSJbJ7wMtfeUhhB2zqhyf1Oc685qB3abAxQ=--iNw+l8x0zRR4UspVYS4uQ8O7mkVu4VOMVWoKnAD/zRI="

curl "${API}${URL_PATH}" \
  --include \
  --request POST \
  --header "Content-Type: application/json" \
  --header "Authorization: Token token=$TOKEN" \
  --data '{
    "example": {
      "text": "'"${TEXT}"'"
    }
  }'
