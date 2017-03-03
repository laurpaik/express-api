#!/bin/sh

API="http://localhost:4741"
URL_PATH="/books"
TOKEN="8EwGkVN8zMRVuMVhmDXHByKhON802fCPFk7e59KewRE=--D4k8591O06JXcgMYoG+j7N7NvYqTDDVoKuIqTJBQo7Q="

curl "${API}${URL_PATH}" \
  --include \
  --request POST \
  --header "Content-Type: application/json" \
  --header "Authorization: Token token=${TOKEN}" \
  --data '{
    "book": {
      "title": "'"${TITLE}"'",
      "author": "'"${AUTHOR}"'",
      "originalLanguage": "'"${LANGUAGE}"'",
      "firstPublished": "'"${PUBLISHED}"'"
    }
  }'

echo
