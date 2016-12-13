#!/bin/sh

curl --include --request GET http://localhost:4741/examples \
  --header "Authorization: Token token=$TOKEN"
