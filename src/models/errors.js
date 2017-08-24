
function AJSValidationError(field, message) {
  this.name = 'AJSValidationError';
  this.field = field,
  this.message = message || 'Validation error';
  // this.stack = (new Error()).stack;
}
AJSValidationError.prototype = Object.create(Error.prototype);
AJSValidationError.prototype.constructor = AJSValidationError;

module.exports = AJSValidationError;