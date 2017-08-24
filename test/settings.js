var supertest = require('supertest');
var chai = require('chai');
var app = require('../src/app');
var nconf = require('../src/lib/nconf');

describe('article.js', function() {
  before(function() {
    nconf.set('env', 'test');
  });
  
  describe('settings controller', function() {
    var data = {
      name: 'site',
      value: 'blog'
    };
    var respData;
    var updateData = {
      name: 'newsite',
      value: 'newblog'
    }
    it('/settings/create', function(done) {
      supertest(app)
        .post('/api/settings')
        .set('User-Agent', 'My cool browser')
        .set('Accept', 'application/json')
        .send(data)
        .expect('Content-Type', /application\/json/)
        .expect(200)
        .expect(function(res) {
          respData = res.body;
          chai.expect(respData).to.be.an('object');
          chai.expect(respData).to.have.all.keys('data', 'status');
          chai.assert.equal(respData.status, 'success', 'res.status = success');
          chai.assert.equal(respData.data.name, data.name, 'res.data.name = ' + data.name);
          chai.assert.equal(respData.data.value, data.value, 'res.data.value = ' + data.value);
        })
        .end(done)
    });

    it('/settings/update', function(done) {
      updateData.id = respData.data.id;
      supertest(app)
        .put('/api/settings')
        .set('User-Agent', 'My cool browser')
        .set('Accept', 'application/json')
        .send(updateData)
        .expect('Content-Type', /application\/json/)
        .expect(200)
        .expect(function(res) {
          let resp = res.body;
          chai.expect(resp).to.be.an('object');
          chai.expect(resp).to.have.all.keys('data', 'status');
          chai.assert.equal(resp.status, 'success', 'res.status = success');
          chai.assert.equal(resp.data.name, updateData.name, 'res.data.name = ' + updateData.name);
          chai.assert.equal(resp.data.value, updateData.value, 'res.data.value = ' + updateData.value);
        })
        .end(done)
    });

    it('/settings/read', function(done) {
      supertest(app)
        .get('/api/settings/' + respData.data.id)
        .set('User-Agent', 'My cool browser')
        .set('Accept', 'application/json')
        .expect('Content-Type', /application\/json/)
        .expect(200)
        .expect(function(res) {
          let resp = res.body;
          chai.expect(resp).to.be.an('object');
          chai.expect(resp).to.have.all.keys('data', 'status');
          chai.assert.equal(resp.status, 'success', 'res.status = success');
          chai.assert.equal(resp.data.name, updateData.name, 'res.data.name = ' + updateData.name);
          chai.assert.equal(resp.data.value, updateData.value, 'res.data.value = ' + updateData.value);
        })
        .end(done)
    });

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
  });
});