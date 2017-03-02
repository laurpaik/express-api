#!/bin/sh

API="http://localhost:4741"
URL_PATH="/books"
TITLE="A book"
AUTHOR="Me"
LANGUAGE="English"
YEAR_PUBLISHED=2017

curl --include --request POST "${API}${URL_PATH}" \
  --header "Content-Type: application/json" \
  --header "Authorization: Token token=$TOKEN" \
  --data '{
    "book": {
      "title": "'"${TITLE}"'",
      "author": "'"${AUTHOR}"'",
      "originalLanguage": "'"${LANGUAGE}"'",
      "firstPublished": '${YEAR_PUBLISHED}'
    }
  }'
