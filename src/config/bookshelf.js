var nconf = require('../lib/nconf'),
    knex = require('knex'),
    Bookshelf = require('bookshelf'),
    ModelBase = require('bookshelf-modelbase');

var bookshelf = Bookshelf(knex(nconf.get('db')));
bookshelf.plugin('registry');
bookshelf.plugin('pagination');
bookshelf.plugin(ModelBase.pluggable);

module.exports = bookshelf;
