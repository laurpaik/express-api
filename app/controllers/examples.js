'use strict';

const controller = require('lib/wiring/controller');
const models = require('app/models');
const Example = models.example;

const authenticate = require('./concerns/authenticate');
const setUser = require('./concerns/set-current-user');
const setModel = require('./concerns/set-mongoose-model');

// index is a function that takes three parameters
// request, response, and next (req, res, next)
// request is an object that represents the client's HTTP request
// response is an object that represents the server's HTTP response to the
// next will call our error handler
// the index action goes and gets all of our resources and
// sends that data to the user
// next is a function that is passed to us based on middleware
// if you don't have next and there's an error,
// the request will just hang out in the controller and you'll be s t u c k
// controller won't know to send a response back to the client
const index = (req, res, next) => {

  // using the mongoose model... mongoose query to get all the examples
  Example.find()

    // get the examples, and when you find them, send a response in JSON
    .then(examples => res.json({

      // response object will be an array of objects
      // look through the array of examples that mongoose gives us
      examples: examples.map((e) =>

        // .toJSON is a mongoose method that converts the object to JSON
        // return only the examples that the current user owns
        e.toJSON({ virtuals: true, user: req.user })),
    }))

    // if there's an error anywhere in this chain, call the next function
    // to send an error response
    .catch(next);
};

const show = (req, res) => {
  // takes the json request, returns a json response
  // setMongooseModel finds the example and sets it to req.example
  // and handles any errors
  // sends a json response with the example and the user data
  res.json({
    example: req.example.toJSON({ virtuals: true, user: req.user }),
  });
};

const create = (req, res, next) => {
  // takes an object, add the properties to the example
  // takes the body of the request and assigns currentUser as the owner
  let example = Object.assign(req.body.example, {
    _owner: req.user._id,
  });
  // mongoose creates an example from the above object
  Example.create(example)
    .then(example =>
      // send 201 AND json
      res.status(201)
        .json({
          example: example.toJSON({ virtuals: true, user: req.user }),
        }))
    .catch(next);
};

const update = (req, res, next) => {
  // delete the owner from the request body
  delete req.body._owner;  // disallow owner reassignment LOL
  // gets the example from the database and updates the body of the example
  // (req.example is a mongoose object that setModel got from the database)
  // .update is a mongoose method that updates the example with the properties
  // from the body of the request
  req.example.update(req.body.example)
    // if the update is successful, send a 204 Status to the client
    .then(() => res.sendStatus(204))
    // otherwise, hit up that middleware w/ next
    // send error to the client LOL
    .catch(next);
};

// setModel will find an example (a mongoose object) for this user
// and set it to the request object
const destroy = (req, res, next) => {
  // request the example we want to delete and remove it
  // .remove() is a mongoose method that removes this object from
  // the database
  req.example.remove()
    // if remove was successful, return a 204 status
    .then(() => res.sendStatus(204))
    // if remove fails, go to your middleware and let it handle the error
    // next deals with that for you LOL
    .catch(next);
};

module.exports = controller({
  index,
  show,
  create,
  update,
  destroy,
}, { before: [
  { method: setUser, only: ['index', 'show'] },
  { method: authenticate, except: ['index', 'show'] },
  { method: setModel(Example), only: ['show'] },
  { method: setModel(Example, { forUser: true }), only: ['update', 'destroy'] },
], });
