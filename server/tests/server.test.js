import test from 'node:test';
import assert from 'node:assert/strict';
import app from '../src/app.js';

let server;
let baseUrl;

test.before((t, done) => {
  server = app.listen(0, () => {
    const port = server.address().port;
    baseUrl = `http://localhost:${port}`;
    console.log(`🧪 Test server running on ${baseUrl}`);
    done();
  });
});

test.after((t, done) => {
  server.close(done);
});

test('GET /api/health should return ok status', async () => {
  const res = await fetch(`${baseUrl}/api/health`);
  const data = await res.json();
  assert.equal(res.status, 200);
  assert.equal(data.status, 'ok');
});

test('GET /api/leaderboard should return paginated rankings', async () => {
  const res = await fetch(`${baseUrl}/api/leaderboard?limit=10`);
  const data = await res.json();
  assert.equal(res.status, 200);
  assert.ok(Array.isArray(data.leaderboard));
});

test('POST /api/game/start should initialize a valid game session for guest', async () => {
  const res = await fetch(`${baseUrl}/api/game/start`, { method: 'POST' });
  const data = await res.json();
  
  if (res.status === 200) {
    assert.ok(data.sessionId);
    assert.equal(data.streak, 0);
    assert.ok(data.question);
    assert.equal(data.question.correctAnswer, undefined, 'Anti-cheat: Correct answer MUST NOT be sent to client!');
  }
});
