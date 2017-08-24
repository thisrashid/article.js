var supertest = require('supertest');
var chai = require('chai');
var app = require('../src/app');
var nconf = require('../src/lib/nconf');

describe('article.js: posts controller', function() {
  var jwtToken = '', respData;
  var data = {
    title: 'Hello World',
    content: 'This post is created by unit testing',
    slug: 'hello-world'
  };
  var updateData = {
    title: 'Hello World+',
    content: 'This post is created by unit testing+',
    slug: 'hello-world-plus'
  }

  before(function(done) {
    nconf.set('env', 'test');
    var user = {
      email: 'thisrashid@gmail.com',
      password: 'abcd'
    }
    supertest(app)
      .post('/api/users/auth')
      .set('User-Agent', 'My cool browser')
      .set('Accept', 'application/json')
      .send(user)
      .expect(200)
      .expect(function(res) {
        let respData = res.body;
        chai.expect(respData).to.be.an('object');
        chai.expect(respData).to.have.all.keys('data', 'status');
        chai.assert.equal(respData.status, 'success', 'res.status = success');
        chai.expect(respData.data.token).to.be.an('string');
        jwtToken = respData.data.token;
      })
      .end(done);
  });

  describe('should give 403 errors', function() {
    
  });

  describe('create a post', function() {
    it('should throw 403 error', function(done) {
      supertest(app)
        .post('/api/posts')
        .set('User-Agent', 'My cool browser')
        .set('Accept', 'application/json')
        .send(data)
        .expect('Content-Type', /application\/json/)
        .expect(403)
        .end(done);
    });

    it('should create a post', function(done) {
      supertest(app)
        .post('/api/posts')
        .set('User-Agent', 'My cool browser')
        .set('Accept', 'application/json')
        .set('x-access-token', jwtToken)
        .send(data)
        .expect('Content-Type', /application\/json/)
        .expect(200)
        .expect(function(res) {
          respData = res.body;
          chai.expect(respData).to.be.an('object');
          chai.expect(respData).to.have.all.keys('data', 'status');
          chai.assert.equal(respData.status, 'success', 'res.status = success');
          chai.assert.equal(respData.data.title, data.title, 'res.data.title = ' + data.title);
          chai.assert.equal(respData.data.content, data.content, 'res.data.content = ' + data.content);
        })
        .end(done);
    });
  });
    
  describe('update a post', function() {
    it('should throw 403 error', function(done) {
      supertest(app)
        .put('/api/posts')
        .set('User-Agent', 'My cool browser')
        .set('Accept', 'application/json')
        .send(data)
        .expect('Content-Type', /application\/json/)
        .expect(403)
        .end(done);
    });

    it('should throw 404 error', function(done) {
      updateData.id = respData.data.id + 1;
      supertest(app)
        .put('/api/posts')
        .set('User-Agent', 'My cool browser')
        .set('Accept', 'application/json')
        .set('x-access-token', jwtToken)
        .send(updateData)
        .expect('Content-Type', /application\/json/)
        .expect(404)
        .end(done)
    });

    it('should update a post', function(done) {
      updateData.id = respData.data.id;
      supertest(app)
        .put('/api/posts')
        .set('User-Agent', 'My cool browser')
        .set('Accept', 'application/json')
        .set('x-access-token', jwtToken)
        .send(updateData)
        .expect('Content-Type', /application\/json/)
        .expect(200)
        .expect(function(res) {
          let resp = res.body;
          chai.expect(resp).to.be.an('object');
          chai.expect(resp).to.have.all.keys('data', 'status');
          chai.assert.equal(resp.status, 'success', 'res.status = success');
          chai.assert.equal(resp.data.title, updateData.title, 'res.data.title = ' + updateData.title);
          chai.assert.equal(resp.data.content, updateData.content, 'res.data.content = ' + updateData.content);
        })
        .end(done)
    });
  });

  describe('read a post', function() {
    it('should throw 404 error', function(done) {
      supertest(app)
        .get('/api/posts/' + respData.data.id + '123')
        .set('User-Agent', 'My cool browser')
        .set('Accept', 'application/json')
        .set('x-access-token', jwtToken)
        .expect('Content-Type', /application\/json/)
        .expect(404)
        .expect(function(res) {
          let resp = res.body;
          chai.expect(resp).to.be.an('object');
          chai.expect(resp).to.have.all.keys('data', 'status');
          chai.assert.equal(resp.status, 'not_found', JSON.stringify(resp));
        })
        .end(done)
    });

    it('should read a post', function(done) {
      supertest(app)
        .get('/api/posts/' + respData.data.id)
        .set('User-Agent', 'My cool browser')
        .set('Accept', 'application/json')
        .set('x-access-token', jwtToken)
        .expect('Content-Type', /application\/json/)
        .expect(200)
        .expect(function(res) {
          let resp = res.body;
          chai.expect(resp).to.be.an('object');
          chai.expect(resp).to.have.all.keys('data', 'status');
          chai.assert.equal(resp.status, 'success', 'res.status = success');
          chai.assert.equal(resp.data.title, updateData.title, 'res.data.title = ' + updateData.title);
          chai.assert.equal(resp.data.content, updateData.content, 'res.data.content = ' + updateData.content);
        })
        .end(done)
    });
  });

  describe('list posts', function() {
    it('should list all posts', function(done) {
      supertest(app)
        .get('/api/posts')
        .set('User-Agent', 'My cool browser')
        .set('Accept', 'application/json')
        .set('x-access-token', jwtToken)
        .expect('Content-Type', /application\/json/)
        .expect(200)
        .expect(function(res) {
          let resp = res.body;
          chai.expect(resp).to.be.an('object');
          chai.expect(resp).to.have.all.keys('data', 'status');
          chai.assert.equal(resp.status, 'success', 'res.status = success');
        })
        .end(done)
    });
  });

  describe('destroy a post', function() {
    it('should throw 403 error', function(done) {
      supertest(app)
        .delete('/api/posts')
        .set('User-Agent', 'My cool browser')
        .set('Accept', 'application/json')
        .send(data)
        .expect('Content-Type', /application\/json/)
        .expect(403)
        .end(done);
    });
  });
    /*
    it('/settings/index', function(done) {
      supertest(app)
        .get('/api/settings')
        .set('User-Agent', 'My cool browser')
        .set('Accept', 'application/json')
        .expect('Content-Type', /application\/json/)
        .expect(200)
        .expect(function(res) {
          let resp = res.body;
          chai.expect(resp).to.be.an('object');
          chai.expect(resp).to.have.all.keys('data', 'status');
          chai.expect(resp.data).to.be.an('array');
          chai.assert.equal(resp.status, 'success', 'res.status = success');
          chai.assert(resp.data.length > 0, 'res.data.length > 0');
        })
        .end(done)
    });

    it('/settings/destroy', function(done) {
      supertest(app)
        .delete('/api/settings')
        .set('User-Agent', 'My cool browser')
        .set('Accept', 'application/json')
        .send({
          id: respData.data.id
        })
        .expect('Content-Type', /application\/json/)
        .expect(200)
        .expect(function(res) {
          let resp = res.body;
          chai.expect(resp).to.be.an('object');
          chai.expect(resp).to.have.all.keys('data', 'status');
          chai.assert.equal(resp.status, 'success', 'res.status = success');
        })
        .end(done)
    });
    */
  // });
});