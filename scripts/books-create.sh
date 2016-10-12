#!/bin/sh
curl --include --request POST http://localhost:3000/books \
  --header "Content-Type: application/json" \
  --header "Authorization: Token token=UrY7C28nvHaZYXcE+SRrSpms9OFU3LvN2qUhXiI8ObY=--Mwy5gFSwJIHJy7xMSpEmyUqYfBFTwCrPuCBKN3ru77A=" \
  --data '{
    "book": {
      "title": "My First Book",
      "author": "Alex K"
    }
  }'
