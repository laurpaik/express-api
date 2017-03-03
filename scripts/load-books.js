'use strict';

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const database = require('../config/database');
mongoose.connect(database.mongoose.uri);
const db = mongoose.connection;

const Book = require('../app/models/book.js');
const mapBook = require('./mapBook.js');

const done = function () {
  db.close();
};

const loadBooks = () =>
  new Promise((resolve, reject) => {
    const books = [];
    const fs = require('fs');
    const parse = require('csv').parse;
    const parser = parse({ columns: true });

    const input = fs.createReadStream('data/books.csv');
    input.on('error', e => reject(e));

    parser.on('readable', () => {
      let record;
      while (record = parser.read()) { // jshint ignore:line
        books.push(mapBook(record));
      }
    });

    parser.on('error', e => reject(e));
    parser.on('finish', () => resolve(books));
    input.pipe(parser);
  });

db.once('open', function () {
  loadBooks()

    // This inserts and runs the documents through mongoose validations
    .then(Book.insertMany)
    .then((docs)=> {
      console.log(docs.length + ' documents inserted');
    })
    .then(done)
    .catch(console.log);
});
