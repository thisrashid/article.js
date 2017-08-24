var models = require('../models'),
    nconf  = require('../lib/nconf'),
    jwt    = require('../middlewares/jwt');

module.exports = {
    __middlewares: {
        index:   [jwt.verify],
        create:  [jwt.verify],
        update:  [jwt.verify],
        destroy: [jwt.verify]
    },
    index : function(req, res) {
        models.User.findAll().then(function(collection) {
            return res.successJson(collection);
        })
        .catch(function(err) {
            res.errorJson(err);
        });
    },
    create : function(req, res) {
        var data = {
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            activation_key: 'test'
        };
        new models.User(data)
            .save()
            .then(function(model) {
                return res.successJson(model);
            })
            .catch(function(err) {
                res.errorJson(err);
            });
    },
    update : function(req, res) {
        var data = {
            id: req.decoded.id
        };
        data.name = req.body.name || req.decoded.name;
        data.password = req.body.password || req.decoded.password;
        new models.User(data)
            .save()
            .then(function(model) {
                return res.successJson(model);
            })
            .catch(function(err) {
                res.errorJson(err);
            });
    },
    read : function(req, res) {
        
        new models.Setting({id : req.params.id})
            .fetch()
            .then(function(model) {
                return res.json({'message' : 'Fetch post by id', data: model});
            });
    },
    destroy : function(req, res) {
        return res.errorJson({message: 'Deletion of user is not allowed'});
        new models.Setting({id: req.body.id})
            .destroy()
            .then(function(model) {
                return res.json(model);
            });
    },
    auth: {
        method: 'post',
        params: '',
        handler: function(req, res) {
            var secret = nconf.get('jwt:secret');
            new models.User({
                email : req.body.email,
                password: req.body.password
            })
            .fetch()
            .then(function(userModel) {
                if(userModel) {
                    var user = userModel.attributes;
                    delete user.password;
                    var token = jwt.sign(user, secret);
                    return res.successJson({token: token});
                } else {
                    return res.json404({'message': 'Invalid username or password'});
                }
            })
            .catch(function(err) {
                return res.errorJson(err);
            });
        }
    }
}