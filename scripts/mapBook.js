'use strict';

const userId = '58b99ba6a5af251d13460ee9';

const mapBook = function (h) {
  let newBook = {};

  Object.keys(h).forEach(function () {
    newBook.author = h.author;
    newBook.title = h.title;
    newBook.originalLanguage = h.original_language;
    newBook.firstPublished = h.first_published;
    newBook._owner = userId;
  });

  return newBook;
};

module.exports = mapBook;
