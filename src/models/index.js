/**
 * Dependencies
 */

var _ = require('lodash');

var models = [
  'posts',
  'settings',
  'users'
];
// var dataProvider = {};

// export function init() {
  models.forEach(function (name) {
      _.extend(exports, require('./' + name));
  });
// }
