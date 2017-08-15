import express from 'express';
import morgan from 'morgan';
import bodyParser from 'body-parser';

const app = express();
app.use(morgan('dev', {
    skip: () => app.get('env') === 'test'
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', function(req, res) {
    return res.json({'message' : 'Hello World!'});
});

// Catch 404 and forward to error handler
app.use((req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
    res
        .status(err.status || 500)
        .render('error', {
            message: err.message
        });
    });

export default app;