/**
 * @jest-environment node
 */
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const supertest = require('supertest');

let app;
let request;
let mongoServer;

describe('Cart API Integration Tests', () => {
  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    // Override MONGO_URI before loading the app so it uses in-memory DB
    process.env.MONGO_URI = uri;
    app = require('../src/index');
    request = supertest(app);
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

  let token;
  let productId;

  beforeEach(async () => {
    // Register a new user and obtain JWT
    const resReg = await request
      .post('/api/auth/register')
      .send({ email: 'test@example.com', username: 'testuser', password: 'password' });
    expect(resReg.status).toBe(201);
    token = resReg.body.token;

    // Create a test product (authenticated)
    const resProd = await request
      .post('/api/products')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Test Product', description: 'desc', price: 9.99, imageUrl: '' });
    expect(resProd.status).toBe(201);
    productId = resProd.body._id;
  });

  test('GET /api/cart returns empty cart', async () => {
    const res = await request
      .get('/api/cart')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
    expect(res.body).toHaveProperty('items');
    expect(Array.isArray(res.body.items)).toBe(true);
    expect(res.body.items.length).toBe(0);
  });

  test('POST /api/cart adds item', async () => {
    const res = await request
      .post('/api/cart')
      .set('Authorization', `Bearer ${token}`)
      .send({ productId, quantity: 2 })
      .expect(200);
    expect(res.body.items).toHaveLength(1);
    expect(res.body.items[0].quantity).toBe(2);
    expect(res.body.items[0].product._id).toBe(productId);
  });

  test('PATCH /api/cart/:productId updates quantity', async () => {
    // First add an item
    await request
      .post('/api/cart')
      .set('Authorization', `Bearer ${token}`)
      .send({ productId, quantity: 1 })
      .expect(200);

    const res = await request
      .patch(`/api/cart/${productId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ quantity: 5 })
      .expect(200);
    expect(res.body.items[0].quantity).toBe(5);
  });

  test('PATCH /api/cart/:productId with zero quantity removes item', async () => {
    await request
      .post('/api/cart')
      .set('Authorization', `Bearer ${token}`)
      .send({ productId, quantity: 3 })
      .expect(200);

    const res = await request
      .patch(`/api/cart/${productId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ quantity: 0 })
      .expect(200);
    expect(res.body.items).toHaveLength(0);
  });

  test('DELETE /api/cart/:productId removes item', async () => {
    await request
      .post('/api/cart')
      .set('Authorization', `Bearer ${token}`)
      .send({ productId, quantity: 1 })
      .expect(200);

    const res = await request
      .delete(`/api/cart/${productId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
    expect(res.body.items).toHaveLength(0);
  });

  test('Unauthorized requests return 401', async () => {
    await request.get('/api/cart').expect(401);
    await request.post('/api/cart').send({ productId, quantity: 1 }).expect(401);
  });

  test('POST /api/cart missing fields returns 400', async () => {
    await request
      .post('/api/cart')
      .set('Authorization', `Bearer ${token}`)
      .send({ quantity: 1 })
      .expect(400);
  });

  test('PATCH /api/cart/:productId missing quantity returns 400', async () => {
    await request
      .patch(`/api/cart/${productId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({})
      .expect(400);
  });
}); 