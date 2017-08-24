var express = require('express'),
    morgan = require('morgan'),
    bodyParser = require('body-parser'),
    rest = require('restify-express'),
    jwt    = require('jsonwebtoken'),
    nconf = require('./lib/nconf'),
    apiRoutes = express.Router(),
    app = express();

app.set('env', process.env.NODE_ENV || 'development');
app.use(morgan('dev', {
    skip: function() {
        return nconf.get('env') === 'test';
    }
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.set('superSecret', 'mysupersecret');

app.use(function(req, res, next) {
    res.json200 = function(json) {
        res.status(200).json({
            status: 'success',
            data: json
        });
    };

    res.json404 = function(json) {
        res.status(404).json({
            status: 'not_found',
            data: json
        });
    };

    res.json403 = function(json) {
        res.status(403).json({
            status: 'unauthorized',
            data: json
        });
    };

    res.json400 = function(json) {
        res.status(403).json({
            status: 'error',
            data: json
        });
    };
    next();
});
app.use(rest({
    controllers : __dirname + '/' + 'controllers',
    app: app,
    router: apiRoutes,
    base: '/api'
}));

// Catch 404 and forward to error handler
app.use(function(req, res, next) {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function(err, req, res, next) { // eslint-disable-line no-unused-vars
    return res
        .status(err.status || 500)
        .json({
            message: err.message
        });
});

module.exports = app;