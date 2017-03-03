'use strict';

// we're using mongoose to define our schema
// mongoose doesn't necessarily have anything to do with Express
// you can use express without mongoose and vice versa LOL
const mongoose = require('mongoose');

const exampleSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },

  // `_` denotes that it's a reference to another mongoose schema
  _owner: {

    // the type of this _owner property is a mongoose schema objectId
    type: mongoose.Schema.Types.ObjectId,

    // the schema that _owner refers to is the User schema
    ref: 'User',
    required: true,
  },
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: function (doc, ret, options) {
      let userId = (options.user && options.user._id) || false;
      ret.editable = userId && userId.equals(doc._owner);
      return ret;
    },
  },
});

exampleSchema.virtual('length').get(function length() {
  return this.text.length;
});

const Example = mongoose.model('Example', exampleSchema);

module.exports = Example;
