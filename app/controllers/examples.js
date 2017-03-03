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
  res.json({
    example: req.example.toJSON({ virtuals: true, user: req.user }),
  });
};

const create = (req, res, next) => {
  let example = Object.assign(req.body.example, {
    _owner: req.user._id,
  });
  Example.create(example)
    .then(example =>
      res.status(201)
        .json({
          example: example.toJSON({ virtuals: true, user: req.user }),
        }))
    .catch(next);
};

const update = (req, res, next) => {
  delete req.body._owner;  // disallow owner reassignment.
  req.example.update(req.body.example)
    .then(() => res.sendStatus(204))
    .catch(next);
};

const destroy = (req, res, next) => {
  req.example.remove()
    .then(() => res.sendStatus(204))
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
