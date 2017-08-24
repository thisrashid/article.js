var Nconf = require('nconf');
var path = require('path');

function Config() {
  var baseConfigPath = __dirname,
      customConfigPath = process.cwd(),
      nconf = new Nconf.Provider();

  nconf.argv().env();
  var environment = nconf.get('NODE_ENV') || 'development';
  nconf.file(environment, path.join(baseConfigPath, '../config/' +  environment.toLowerCase() + '.json'));
  return nconf;
}

module.exports = Config();