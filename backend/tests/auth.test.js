/**
 * @jest-environment node
 */
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const supertest = require('supertest');

let app, agent, mongoServer;

describe('Auth API Integration Tests', () => {
  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    process.env.MONGO_URI = uri;
    process.env.NODE_ENV = 'test';
    app = require('../src/index');
    agent = supertest.agent(app);
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  beforeEach(async () => {
    // Clear database between tests
    const collections = mongoose.connection.collections;
    for (const key in collections) {
      await collections[key].deleteMany({});
    }
  });

  test('POST /api/auth/register - creates user, returns token and sets refresh cookie', async () => {
    const res = await agent
      .post('/api/auth/register')
      .send({ email: 'a@a.com', username: 'userA', password: 'pass123' })
      .expect(201);
    expect(res.body).toHaveProperty('token');
    expect(res.body.user).toMatchObject({ email: 'a@a.com', username: 'userA' });
    const cookies = res.headers['set-cookie'];
    expect(cookies).toBeDefined();
    expect(cookies.some(c => c.startsWith('refreshToken='))).toBe(true);
  });

  test('POST /api/auth/login - returns token and sets refresh cookie', async () => {
    await agent
      .post('/api/auth/register')
      .send({ email: 'b@b.com', username: 'userB', password: 'pass123' });

    const res = await agent
      .post('/api/auth/login')
      .send({ email: 'b@b.com', password: 'pass123' })
      .expect(200);
    expect(res.body).toHaveProperty('token');
    const cookies = res.headers['set-cookie'];
    expect(cookies.some(c => c.startsWith('refreshToken='))).toBe(true);
  });

  test('POST /api/auth/refresh - returns new token when refresh cookie present', async () => {
    await agent
      .post('/api/auth/register')
      .send({ email: 'c@c.com', username: 'userC', password: 'pass123' });

    const res = await agent.post('/api/auth/refresh').expect(200);
    expect(res.body).toHaveProperty('token');
  });

  test('POST /api/auth/refresh - missing cookie returns 401', async () => {
    const freshAgent = supertest(app);
    await freshAgent.post('/api/auth/refresh').expect(401);
  });

  test('POST /api/auth/logout - clears refresh cookie', async () => {
    await agent
      .post('/api/auth/register')
      .send({ email: 'd@d.com', username: 'userD', password: 'pass123' });

    const res = await agent.post('/api/auth/logout').expect(200);
    const cookies = res.headers['set-cookie'];
    expect(cookies.some(c => c.startsWith('refreshToken=;'))).toBe(true);
  });
}); 