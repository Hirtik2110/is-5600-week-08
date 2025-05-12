const { list, get, destroy } = require('../products');
const productTestHelper = require('./test-utils/productTestHelper');
const { mockModel } = require('./db.mock');

// Mock the db module to use our mockDb
jest.mock('../db', () => require('./db.mock').mockDb);

describe('Product Module', () => {
  beforeEach(() => {
        jest.clearAllMocks();
  });
  // Set up and clean up test data
  beforeAll(async () => {
    await productTestHelper.setupTestData();
  });

  afterAll(async () => {
    await productTestHelper.cleanupTestData();
  });

  describe('list', () => {
    it('should list products', async () => {
        const products = await list();
        expect(products.length).toBe(2);
        expect(products[0].description).toBe('Product 1');
        expect(products[1].description).toBe('Product 2');
    });
  });

  describe('get', () => {
    it('should get a product by id', async () => {
      // Mock the Product.findById method to return a specific product
      mockModel.findById = jest.fn().mockResolvedValue({ description: 'Product 1' });

      const products = await get('ID');

      expect(products).toBeDefined();
      expect(products.description).toBe('Product 1');
    });
  });

  describe('destroy', () => {
    it('should destroy a product by id', async () => {
      // Mock the Product.deleteOne method to return a deleted count
      mockModel.deleteOne = jest.fn().mockResolvedValue({ deletedCount: 1 });

      const products = await destroy('ID');

      expect(products).toBeDefined();
      expect(products.deletedCount).toBeDefined();
      expect(products.deletedCount).toBe(1);
    });
  });
});