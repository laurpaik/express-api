#!/bin/sh
ID=''

curl --include --request GET http://localhost:4741/books/${ID}
