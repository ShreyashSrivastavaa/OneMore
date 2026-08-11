import test from 'node:test';
import assert from 'node:assert/strict';
import app from '../src/app.js';

let server;
let baseUrl;

test.before((t, done) => {
  server = app.listen(0, () => {
    const port = server.address().port;
    baseUrl = `http://localhost:${port}`;
    done();
  });
});

test.after((t, done) => {
  server.close(done);
});

test('GET /api/auth/github should initiate GitHub OAuth 302 redirect with valid client_id', async () => {
  const res = await fetch(`${baseUrl}/api/auth/github`, { redirect: 'manual' });
  
  assert.equal(res.status, 302, 'Expected HTTP 302 Redirect to GitHub OAuth server');
  
  const location = res.headers.get('location');
  assert.ok(location, 'Expected location header');
  assert.ok(location.includes('github.com/login/oauth/authorize'), 'Location header must target GitHub authorization URL');
  assert.ok(location.includes('client_id=Ov23liQ1s3IeAzsuS7JS'), 'Location header must contain configured GitHub Client ID!');
  assert.ok(location.includes('redirect_uri='), 'Location header must contain OAuth redirect URI!');
  
  console.log('✅ GitHub OAuth 302 Redirect verified successfully:', location);
});
