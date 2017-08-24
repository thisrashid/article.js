var bookshelf = require('../config/bookshelf'),
    Joi = require('joi'),
    AJSValidationError = require('./errors'),
    Setting,
    Settings;

Setting = bookshelf.Model.extend({
  tableName: 'settings',

  validate: {
    name: Joi.string()
            .error(new Error('name', 'name is required'))
            .required(),
    value: Joi.any()
            .error(new AJSValidationError('value', 'value is required'))
            .required()
  }
});

Settings = bookshelf.Collection.extend({
  model: Setting
});

module.exports = {
  Setting: bookshelf.model('Setting', Setting),
  Settings: bookshelf.collection('Settings', Settings)
};
