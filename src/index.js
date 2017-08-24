var app = require('./app');
var conf = require('./lib/nconf');

var PORT = conf.get('app:port');
app.listen(PORT, function() {
  console.log('Listening on port ' + PORT);
});