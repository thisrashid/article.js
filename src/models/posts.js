var bookshelf = require('../config/bookshelf'),
    users = require('./users'),
    Joi = require('joi'),
    Post,
    Posts;

Post = bookshelf.Model.extend({
  tableName: 'posts',

  validate: {
    title: Joi.any().required(),
    content: Joi.any().required(),
    author: Joi.number(),
    slug: Joi.any().optional(),
    status:Joi.string().optional(),
    type: Joi.string().optional()
  },

  author: function() {
    return this.belongsTo('User', 'author');
  }
});

Posts = bookshelf.Collection.extend({
  model: Post
});

module.exports = {
  Post: bookshelf.model('Post', Post),
  Posts: bookshelf.collection('Posts', Posts)
};
