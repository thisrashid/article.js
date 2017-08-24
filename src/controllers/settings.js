var models = require('../models');

module.exports = {
    
    index : function(req, res) {
        // models.Setting.collection().fetch().then(function(collection) {
        models.Setting.findAll().then(function(collection) {
            return res.successJson(collection);
        })
        .catch(function(err) {
            res.errorJson(err);
        });
    },
    create : function(req, res) {
        var data = {
            name: req.body.name,
            value: req.body.value
        };

        new models.Setting(data)
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
            id: req.body.id,
            name: req.body.name,
            value: req.body.value
        };
        new models.Setting(data)
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
                if(model) {
                    return res.json200(model);
                } else {
                    return res.json404(model);
                }
            })
            .catch(function(err) {
                res.errorJson(err);
            });
    },
    destroy : function(req, res) {
        new models.Setting({id: req.body.id})
            .destroy()
            .then(function(model) {
                return res.successJson(model);
            })
            .catch(function(err) {
                res.errorJson(err);
            });
    }
}