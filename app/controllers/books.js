'use strict';

const controller = require('lib/wiring/controller');
const models = require('app/models');
const Book = models.book;
const User = models.user;

const authenticate = require('./concerns/authenticate');

const index = (req, res, next) => {
  // Access the database, find all the books
  Book.find()
    .populate('_owner', 'email')
    // render the response from the database as json
    .then(books => res.json({ books }))
    // if there's an error, it is caught and sent to error handling middleware
    .catch(err => next(err));
};

const show = (req, res, next) => {
  // takes the id from the request object params
  // finds that object in the database
  Book.findById(req.params.id)
    // gets the book by id
    // sends a json response if an book object is returned, if not, calls next()
    .then(book => book ? res.json({ book }) : next())
    // if there's an error, call next with that error
    .catch(err => next(err));
};

const create = (req, res, next) => {
  let book = Object.assign(req.body.book, {
    _owner: req.currentUser._id,
  });
  Book.create(book)
    // the newly created book we get from the database is rendered as JSON
    .then(newBook => {
      // find the user, and add the book to their collection
      User.findOne(req.currentUser._id)
        .then((user) => {
          user._books.addToSet(newBook._id);
          return user.save();
        })
        .then(() => res.json({ book: newBook }));
    })
    // if theres an error, send to the error handler
    .catch(err => next(err));
};

const update = (req, res, next) => {
  let search = { _id: req.params.id, _owner: req.currentUser._id };

  Book.findOne(search)
    // if successful
    .then(book => {
      // checks if there's an book
      if (!book) {
        // if there's not an book, call next
        return next();
      }
      delete req.body._owner;  // disallow owner reassignment.
      return book.update(req.body.book);
    })
    .then((updated) => {
      if(!updated) {
        return next();
      }
      res.sendStatus(200);
    })
    // if find or update fails we send it to the error handler
    .catch(err => next(err));
};

const destroy = (req, res, next) => {
  // create an object with the book id, and the current user's id as _owner
  let search = { _id: req.params.id, _owner: req.currentUser._id };
  // use the book model, and call the findOne method to find an book that
  // matches the search terms
  Book.findOne(search)
    .then(book => {
      // if the book is falsy
      // if the search parameters didn't match any books
      if (!book) {
        // call the next function
        return next();
      }
      // removes the book from the database (destroys it)
      return book.remove();
    })
    // if removing the book object was successful, return 200 http response
    .then((destroyed) => {
      if(!destroyed) {
        return next();
      }
      res.sendStatus(200);
    })
    // handles any errors
    .catch(err => next(err));
};

module.exports = controller({
  index,
  show,
  create,
  update,
  destroy,
}, { before: [
  { method: authenticate, except: ['index', 'show'] },
], });
