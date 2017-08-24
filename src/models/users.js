var bookshelf = require('../config/bookshelf'),
    posts = require('./posts'),
    Joi = require('joi'),
    User,
    Users;

User = bookshelf.Model.extend({
  tableName: 'users',

  initialize: function(attributes, options) {
    this.on('fetched', this.onFetched);
  },

  onFetched: function(model) {
    delete model.attributes.password;
  },

  validate: {
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    name: Joi.string().required(),
    activation_key: Joi.string().required(),
    status: Joi.string()
  },

  posts: function() {
    return this.hasMany('Posts', 'author');
  }
});

Users = bookshelf.Collection.extend({
  model: User
});

module.exports = {
  User: bookshelf.model('User', User),
  Users: bookshelf.collection('Users', Users)
};
