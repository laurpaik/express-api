'use strict';

const HttpError = require('lib/wiring/errors/http-error');

// looks for a specific example (or book)
// sets that on the request
const setMongooseModel = (model, options) =>
  function (req, res, next) {
    let search = { _id: req.params.id };
    if (options && options.forUser) {
      search._owner = req.user;
    }

    // in our case, this will be Example.findOne()
    model.findOne(search, (error, document) => {
      error = error || !document && new HttpError(404);
      if (error) {
        return next(error);
      }

      // if there's no error getting the example from the database
      // it sets req.example to the mongoose document it found
      req[model.modelName.toLowerCase()] = document;
      next();
    });
  };

module.exports = setMongooseModel;
