const { create, get, list, edit } = require('../orders');
const orderData = require('../data/order1.json');
const productTestHelper = require('./test-utils/productTestHelper');
const { describe } = require('node:test');

describe('Orders Module', () => {
 
  let createdProduct;
  let createdOrder;

  // Populate the database with dummy data
  beforeAll(async () => {
    await productTestHelper.setupTestData();
    await productTestHelper.createTestOrders(5);
  });

  afterAll(async () => {
    await productTestHelper.cleanupTestData();
  });

  describe('create', () => {
    it('should create an order', async () => {
      createdOrder = await create(orderData);
      expect(createdOrder).toBeDefined();
      expect(createdOrder.buyerEmail).toBe(orderData.buyerEmail);
    });
  });

  describe('list', () => {
    it('should list orders', async () => {
      const orders = await list();
      expect(orders.length).toBeGreaterThan(4);
    });
  });

  describe('get', () => {
    it('should get an order', async () => {
        const order = await get(createdOrder._id);
        expect(order).toBeDefined();
    });
  });

  describe('edit', () => {
    it('should edit an order', async () => {
        const change = {
            "buyerEmail": "prachi.v@slu.com",
            "products": [
              "asdrrefwefw234", 
              "qaefwfewefwefe"
            ],
            "status": "COMPLETED"
        }
        const editedOrder = await edit(createdOrder._id, change);

        expect(editedOrder).toBeDefined();
        expect(editedOrder.buyerEmail).toBe('prachi.v@slu.com');
        expect(editedOrder.products).toStrictEqual([
             "asdrrefwefw234", 
             "qaefwfewefwefe"
        ]);
        expect(editedOrder.status).toBe('COMPLETED');

    });
  });
});

const { MongoClient } = require('mongodb');
let connection, db;

beforeAll(async () => {
  connection = await MongoClient.connect(globalThis.__MONGO_URI__, {
    useNewUrlParser: true, useUnifiedTopology: true
  });
  db = await connection.db(globalThis.__MONGO_DB_NAME__);
});

afterAll(async () => {
  await connection.close();
});
