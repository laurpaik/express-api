'use strict';

const controller = require('lib/wiring/controller');
const models = require('app/models');
const Example = models.example;

const authenticate = require('./concerns/authenticate');

// index is a function that takes three parameters
// request, response, and next
// request and response are objects that represent http
// request and response
// next is a function that sends the request/response to the next function in the chain
// if it is passed an object, it goes to the error handler
const index = (req, res, next) => {
  // Access the database, find all the examples
  Example.find()
    // render the response from the database as json
    .then(examples => res.json({ examples }))
    // if there's an error, it is caught and sent to error handling middleware
    .catch(err => next(err));
};

// takes request, response objects and a next function
const show = (req, res, next) => {
  // takes the id from the request object params
  // finds that object in the database
  Example.findById(req.params.id)
    // gets the example by id
    // sends a json response if an example object is returned, if not, calls next()
    .then(example => example ? res.json({ example }) : next())
    // if there's an error, call next with that error
    .catch(err => next(err));
};


const create = (req, res, next) => {
  // adds a key, _owner to req.body.example, and sets that to req.currentUser.id
  let example = Object.assign(req.body.example, {
    _owner: req.currentUser._id,
  });
  // executes the create method on the example model with the example object
  // that we just created with the data from the client and the current user as _owner
  Example.create(example)
    // the newly created example we get from the database is rendered as JSON
    .then(newExample => res.json({ example: newExample }))
    // if theres an error, send to the error handler
    .catch(err => next(err));
};

const update = (req, res, next) => {
  // creates an object with the id of the example passed to us by the user
  // and the currentUser's id as _owner
  let search = { _id: req.params.id, _owner: req.currentUser._id };
  // Finding an example from the database with the id passed to us in the reqest,
  // and the current user as owner
  // will return null if the current user is not the owner of the example
  Example.findOne(search)
    // if successful
    .then(example => {
      // checks if there's an example
      if (!example) {
        // if there's not an example, call next
        return next();
      }
      // protects agains malicious users by deleting the _owner key from req.body
      delete req.body._owner;  // disallow owner reassignment.
      // returns a promise with the updated example
      return example.update(req.body.example);
    })
    // if the update is successful, we send a 200 status to the client
    .then(() => res.sendStatus(200))
    // if find or update fails we send it to the error handler
    .catch(err => next(err));
};

const destroy = (req, res, next) => {
  // create an object with the example id, and the current user's id as _owner
  let search = { _id: req.params.id, _owner: req.currentUser._id };
  // use the example model, and call the findOne method to find an example that
  // matches the search terms
  Example.findOne(search)
    .then(example => {
      // if the example is falsy
      // if the search parameters didn't match any examples
      if (!example) {
        // call the next function
        return next();
      }
      // removes the example from the database (destroys it)
      return example.remove();
    })
    // if removing the example object was successful, return 200 http response
    .then(() => res.sendStatus(200))
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
  // runs the authenticate middleware for all controller actions except index
  // and show
  { method: authenticate, except: ['index', 'show'] },
], });
