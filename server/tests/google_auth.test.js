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

test('GET /api/auth/google should initiate Google OAuth 302 redirect with valid client_id', async () => {
  const res = await fetch(`${baseUrl}/api/auth/google`, { redirect: 'manual' });
  
  assert.equal(res.status, 302, 'Expected HTTP 302 Redirect to Google OAuth server');
  
  const location = res.headers.get('location');
  assert.ok(location, 'Expected location header');
  assert.ok(location.includes('accounts.google.com/o/oauth2/v2/auth'), 'Location header must target Google authorization URL');
  assert.ok(location.includes('client_id=68558442500-faku3av5ggios0kol831ep5f6kmti7bh.apps.googleusercontent.com'), 'Location header must contain configured Google Client ID!');
  assert.ok(location.includes('redirect_uri='), 'Location header must contain OAuth redirect URI!');
  
  console.log('✅ Google OAuth 302 Redirect verified successfully:', location);
});
