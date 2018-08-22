import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../src/app.js';

chai.use(chaiHttp);
const expect = chai.expect;

// Constants
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InNwaWRlciIsInBhc3N3b3JkIjo' +
    'iU3BpZGVybWFpbDAyIiwiaWF0IjoxNTM0OTEzMjA5LCJleHAiOjE1MzQ5OTk2MDl9.6urltvbV5YZyeR' +
    'VmQcU_j7jPqlxb-FuHQuXAPx3qIFA';
const uri = 'https://vignette.wikia.nocookie.net/disney/images/1/1f/Izzy-Surfin%27_Turf03.jpg' +
    '/revision/latest?cb=20150209102417';

// Test root endpoint
describe('GET /', () => {
  it('should render properly', done => {
    chai
      .request(app)
      .get('/')
      .then(res => {
        expect(res.statusCode)
          .to
          .eql(200);
        done();
      })
      .catch(err => {
        throw done(err);
      });
  });
});

// Test 404 error
describe('GET /404', () => {
  it('should return 404 for non-existent URLs', done => {
    chai
      .request(app)
      .get('/404')
      .then(res => {
        expect(res.statusCode)
          .to
          .eql(404);
      })
      .then(() => {
        chai
          .request(app)
          .get('/notfound')
          .then(res => {
            expect(res.statusCode)
              .to
              .eql(404);
            done();
          });
      })
      .catch(err => {
        throw done(err);
      });
  });
});

// Test Authentication
describe('POST /login', () => {
  it('should authenticate user with and respond with an object containing a signed jwt' +
      ' token',
  done => {
    let user = {
      username: 'kenny',
      password: 'kkksss'
    };

    chai
      .request(app)
      .post('/login')
      .send(user)
      .end((err, res) => {
        if (err) 
          throw done(err);
        expect(res.statusCode)
          .to
          .eql(200);
        expect(res.body)
          .to
          .have
          .nested
          .property('token');
        done();
      });
  });

  it('should fail to auth user without a required body property', done => {
    let nuser = {
      username: 'ken'
    };

    chai
      .request(app)
      .post('/login')
      .send(nuser)
      .end((err, res) => {
        if (err) 
          throw done(err);
        expect(res.statusCode)
          .to
          .eql(401);
        done();
      });
  });
});

// Test Patch Api Endpoint
describe('POST /patch', () => {
  it('should patch a json object', done => {
    let json = {
      baz: 'qux',
      foo: 'bar'
    };
    let patch = [
      {
        op: 'replace',
        path: '/baz',
        value: 'Hackerbay'
      }
    ];
    let body = {
      json: JSON.stringify(json),
      patch: JSON.stringify(patch)
    };

    chai
      .request(app)
      .post('/patch')
      .set('Authorization', token)
      .send(body)
      .end((err, res) => {
        if (err) 
          throw done(err);
        
        expect(res.statusCode)
          .to
          .eql(200);
        expect(res.body)
          .to
          .have
          .nested
          .property('patchedObj');
        done();
      });
  });
});

// Test Patch Api Endpoint
describe('POST /thumbnail', () => {
  it('should generate thumbnail from image uri', done => {
    chai
      .request(app)
      .post('/thumbnail')
      .set('Authorization', token)
      .query({url: uri})
      .end((err, res) => {
        if (err) 
          throw done(err);
        expect(res.statusCode)
          .to
          .eql(200);

        done();
      });
  });

  it('should fail, generating thumbnail without authorization', done => {
    chai
      .request(app)
      .post('/thumbnail')
      .query({url: uri})
      .end((err, res) => {
        if (err) 
          throw done(err);
        
        expect(res.statusCode)
          .to
          .eql(403);
        done();
      });
  });

  it('should fail, generating thumbnail without url property in query', done => {
    chai
      .request(app)
      .post('/thumbnail')
      .set('Authorization', token)
      .query({url: ''})
      .end((err, res) => {
        if (err) 
          throw done(err);
        
        expect(res.statusCode)
          .to
          .eql(401);
        done();
      });
  });

});
