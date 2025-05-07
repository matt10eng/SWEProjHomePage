/**
 * @jest-environment node
 */
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const supertest = require('supertest');

let app;
let request;
let mongoServer;

describe('Order API Integration Tests', () => {
  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    process.env.MONGO_URI = uri;
    app = require('../src/index');
    request = supertest(app);
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  beforeEach(async () => {
    // Clear all collections for isolation
    const collections = mongoose.connection.collections;
    for (const key in collections) {
      await collections[key].deleteMany({});
    }
  });

  let token;
  let productA;
  let productB;
  let createdOrderId;

  beforeEach(async () => {
    // 1. Register and login to get JWT
    const resReg = await request
      .post('/api/auth/register')
      .send({ email: 'order@test.com', username: 'orderUser', password: 'pass123' });
    expect(resReg.status).toBe(201);
    token = resReg.body.token;

    // 2. Create two products for ordering
    const resA = await request
      .post('/api/products')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Prod A', description: 'First product', price: 10.0, imageUrl: '' });
    expect(resA.status).toBe(201);
    productA = resA.body._id;

    const resB = await request
      .post('/api/products')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Prod B', description: 'Second product', price: 20.0, imageUrl: '' });
    expect(resB.status).toBe(201);
    productB = resB.body._id;
  });

  test('GET /api/orders returns empty array when no orders exist', async () => {
    const res = await request
      .get('/api/orders')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(0);
  });

  test('POST /api/orders without items returns 400', async () => {
    await request
      .post('/api/orders')
      .set('Authorization', `Bearer ${token}`)
      .send({})
      .expect(400);
  });

  test('POST /api/orders creates an order with default free shipping', async () => {
    const items = [
      { productId: productA, quantity: 2 },
      { productId: productB, quantity: 1 }
    ];
    const res = await request
      .post('/api/orders')
      .set('Authorization', `Bearer ${token}`)
      .send({ items })
      .expect(201);

    // Validate response structure
    expect(res.body).toHaveProperty('_id');
    expect(res.body.items).toHaveLength(2);
    expect(res.body.shippingOption).toBe('free');
    // subtotal = 2*10 + 1*20 = 40, shipping = 0
    expect(res.body.total).toBe(40);

    createdOrderId = res.body._id;
  });

  test('POST /api/orders considers shipping cost when provided', async () => {
    const items = [{ productId: productA, quantity: 3 }];
    const res = await request
      .post('/api/orders')
      .set('Authorization', `Bearer ${token}`)
      .send({ items, shippingOption: 'twoDay' })
      .expect(201);

    // subtotal = 3 * 10 = 30, shipping = 5
    expect(res.body.total).toBe(35);
    expect(res.body.shippingOption).toBe('twoDay');
  });

  test('GET /api/orders returns list containing the created order', async () => {
    // Create one order for productA
    const createRes = await request
      .post('/api/orders')
      .set('Authorization', `Bearer ${token}`)
      .send({ items: [{ productId: productA, quantity: 1 }] })
      .expect(201);
    const orderId = createRes.body._id;

    // Fetch list of orders and verify the created order is present
    const listRes = await request
      .get('/api/orders')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
    expect(Array.isArray(listRes.body)).toBe(true);
    expect(listRes.body).toHaveLength(1);
    expect(listRes.body[0]._id).toBe(orderId);
  });

  test('GET /api/orders/:id retrieves the correct order', async () => {
    // Create an order and fetch it by ID
    const createRes = await request
      .post('/api/orders')
      .set('Authorization', `Bearer ${token}`)
      .send({ items: [{ productId: productB, quantity: 2 }] })
      .expect(201);
    const oid = createRes.body._id;

    const getRes = await request
      .get(`/api/orders/${oid}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
    expect(getRes.body._id).toBe(oid);
    expect(getRes.body.items[0].quantity).toBe(2);
  });

  test('GET /api/orders/:id with non-existent ID returns 404', async () => {
    await request
      .get('/api/orders/000000000000000000000000')
      .set('Authorization', `Bearer ${token}`)
      .expect(404);
  });

  test('Unauthorized requests to orders endpoints return 401', async () => {
    await request.get('/api/orders').expect(401);
    await request.post('/api/orders').send({ items: [] }).expect(401);
    await request.get('/api/orders/anyid123').expect(401);
  });
}); 