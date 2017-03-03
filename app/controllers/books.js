'use strict';
const controller = require('lib/wiring/controller');
const models = require('app/models');
const Book = models.book;

const authenticate = require('./concerns/authenticate');
const setUser = require('./concerns/set-current-user');
const setModel = require('./concerns/set-mongoose-model');

const index = (req, res, next) => {
  Book.find()
    .then(books => res.json({
      books: books.map((book) =>
        book.toJSON({ virtuals: true, user: req.user })),
    }))
    .catch(next);
};

module.exports = controller({
  index,
}, { before: [
  { method: setUser, only: ['index', 'show'] },
  { method: authenticate, except: ['index', 'show'] },
  { method: setModel(Book), only: ['show'] },
  { method: setModel(Book, { forUser: true }), only: ['update', 'destroy'] },
], });
