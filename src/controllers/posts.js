var models = require("../models"),
  jwt = require("../middlewares/jwt");

/**
 * @namespace Posts
 * 
 * @desc
 * RESTful Posts controller to handle all posts related requests
 */
var Posts = {
  /**
   * @type {object} 
   * 
   * Middleware configuration for all actions for this controller
   * 
   * <pre><code>
   * {
   *    action1 : [middlewares],<br>
   *    action2 : [middlewares]
   * }
   * </code></pre>
   */
  __middlewares: {
    index: [jwt.verify],
    create: [jwt.verify],
    update: [jwt.verify],
    destroy: [jwt.verify]
  },

  /**
   * @method Posts.index
   * 
   * @param {number} pageSize - no of records per page
   * @param {number} page - page no
   * 
   * @description
   * List all published posts. Accepts GET method. By default pageSize = 10 and page = 1
   * 
   */
  index: function(req, res) {
    var query = req.query || {},
      pageSize = query.pageSize || 10,
      page = query.page || 1;

    models.Post
      .forge()
      .where(
        {
          // author: req.decoded.id
        }
      )
      .orderBy("-created_at")
      .fetchPage({
        withRelated: ["author"],
        pageSize: pageSize,
        page: page
      })
      .then(function(post) {
        res.successJson(post);
      })
      .catch(function(err) {
        res.errorJson(err);
      });
  },

  /**
   * @method Posts.create
   * 
   * @param {string} title - no of records per page
   * @param {string} content - page no
   * @param {string} slug - userId 
   * 
   * @description
   * To create a new post. Accepts POST method
   * 
   */
  create: function(req, res) {
    var data = {
      title: req.body.title,
      content: req.body.content,
      author: req.decoded.id,
      slug: req.body.slug
    };
    new models.Post(data)
      .save()
      .then(function(model) {
        return res.successJson(model);
      })
      .catch(function(err) {
        res.errorJson(err);
      });
  },

  /**
   * @method Posts.update
   * 
   * @param {number} id - post id
   * @param {string} title - no of records per page
   * @param {string} content - page no
   * @param {string} slug - userId 
   * 
   * @description
   * To update existing post. Accepts PUT method
   * 
   */
  update: function(req, res) {
    var data = {
      id: req.body.id,
      title: req.body.title,
      content: req.body.content,
      slug: req.body.slug
    };
    models.Post
      .forge({
        id: req.body.id
      })
      .fetch()
      .then(function(model) {
        if (model && model.attributes.author === req.decoded.id) {
          models.Post
            .forge(data)
            .save()
            .then(function(model) {
              return res.successJson(model);
            })
            .catch(function(err) {
              return res.errorJson(err);
            });
        } else {
          return res.json404({ message: "Post not found" });
        }
      });
  },

  /**
   * @method Posts.read
   * 
   * @param {number} :id - post id
   * 
   * @description
   * To read an existing post. Accepts GET method
   * 
   */
  read: function(req, res) {
    models
      .Post
      .forge({ 
        id: req.params.id 
      })
      .fetch()
      .then(function(model) {
        if (model) {
          return res.json200(model);
        } else {
          return res.json404(model);
        }
      })
      .catch(function(err) {
        res.errorJson(err);
      });
  },
  destroy: function(req, res) {
    return res.json({ message: "Delete a post" });
  }
};

module.exports = Posts;