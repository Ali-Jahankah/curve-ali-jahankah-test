const assert = require('assert');
const request = require('supertest');

const app = require('../app');

describe('Testing API', () => {
  describe('GET / (Root Route)', () => {
    it('Should return Hello World', (done) => {
      request(app)
        .get('/')
        .expect(200)
        .end((err, res) => {
          if (err) done(err);
          assert.equal(res.text, 'Hello World');
          done();
        });
    });
  });
});
