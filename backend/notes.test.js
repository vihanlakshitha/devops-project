const request = require('supertest');
const app = require('./server');
const { pool, initDb } = require('./db');

beforeAll(async () => {
  await initDb();
  await pool.query('DELETE FROM notes');
});

afterAll(async () => {
  await pool.end();
});

describe('notes API', () => {
  it('starts with an empty list', async () => {
    const res = await request(app).get('/api/notes');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  it('creates and lists a note', async () => {
    const create = await request(app).post('/api/notes').send({ text: 'Learn Terraform' });
    expect(create.status).toBe(201);
    expect(create.body.text).toBe('Learn Terraform');
    expect(create.body.id).toBeDefined();

    const list = await request(app).get('/api/notes');
    expect(list.status).toBe(200);
    expect(list.body).toHaveLength(1);
    expect(list.body[0].text).toBe('Learn Terraform');
  });

  it('rejects empty text', async () => {
    const res = await request(app).post('/api/notes').send({ text: '   ' });
    expect(res.status).toBe(400);
  });
});
