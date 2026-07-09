const request = require('supertest');
const app = require('./server');

describe('GET /api/health', () => {
  it('returns status ok', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: 'ok' });
  });
});

describe('GET /api/message', () => {
  it('returns a message string', async () => {
    const res = await request(app).get('/api/message');
    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Hello from the backend!');
  });
});
