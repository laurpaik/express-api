#!/bin/sh

# Things to change when copying:
# URL_PATH
# Decide whether or not we need a token
# 404 errors are almost always about routes fyi LOL
API="http://localhost:4741"
URL_PATH="/books"

curl "${API}${URL_PATH}" \
  --include \
  --request GET

echo
