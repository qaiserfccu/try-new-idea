const fetch = require('node-fetch');

class TestRunner {
  constructor(baseURL = 'http://localhost:3001') {
    this.baseURL = baseURL;
    this.userToken = null;
  }

  async runTests() {
    console.log('🚀 Starting ChiltanPure E2E Tests\n');

    const tests = [
      this.testProductsAPI,
      this.testUserRegistration,
      this.testUserLogin,
      this.testCartOperations,
      this.testOrderCreation,
      this.testProfileUpdate,
    ];

    let passed = 0;
    let failed = 0;

    for (const test of tests) {
      try {
        console.log(`Running: ${test.name}`);
        await test.call(this);
        console.log(`✅ ${test.name} PASSED\n`);
        passed++;
      } catch (error) {
        console.log(`❌ ${test.name} FAILED: ${error.message}\n`);
        failed++;
      }
    }

    console.log(`📊 Test Results: ${passed} passed, ${failed} failed`);

    if (failed === 0) {
      console.log('🎉 All tests passed!');
      process.exit(0);
    } else {
      console.log('💥 Some tests failed!');
      process.exit(1);
    }
  }

  async testProductsAPI() {
    const response = await fetch(`${this.baseURL}/api/products`);
    if (!response.ok) {
      throw new Error('Products API failed');
    }

    const data = await response.json();
    if (!data.products || data.products.length === 0) {
      throw new Error('No products returned');
    }

    console.log(`   Found ${data.products.length} products`);
  }

  async testUserRegistration() {
    const userData = {
      name: 'Test User E2E',
      email: `test-${Date.now()}@example.com`,
      password: 'password123',
      phone: '+923001234567',
    };

    const response = await fetch(`${this.baseURL}/api/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      throw new Error('User registration failed');
    }

    const data = await response.json();
    if (!data.user || !data.user.id) {
      throw new Error('Invalid registration response');
    }

    this.testUserId = data.user.id;
    console.log(`   Registered user: ${data.user.email}`);
  }

  async testUserLogin() {
    const loginData = {
      email: 'test@example.com', // Use existing test user
      password: 'password123',
    };

    const response = await fetch(`${this.baseURL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(loginData),
    });

    if (!response.ok) {
      throw new Error('User login failed');
    }

    const data = await response.json();
    if (!data.user || !data.user.id) {
      throw new Error('Invalid login response');
    }

    this.testUserId = data.user.id;
    console.log(`   Logged in user: ${data.user.email}`);
  }

  async testCartOperations() {
    if (!this.testUserId) {
      throw new Error('No user ID available');
    }

    // Add item to cart
    const addResponse = await fetch(`${this.baseURL}/api/cart`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: this.testUserId,
        productId: 1, // Assuming product ID 1 exists
        quantity: 2,
      }),
    });

    if (!addResponse.ok) {
      throw new Error('Add to cart failed');
    }

    // Get cart
    const getResponse = await fetch(`${this.baseURL}/api/cart?userId=${this.testUserId}`);
    if (!getResponse.ok) {
      throw new Error('Get cart failed');
    }

    const cartData = await getResponse.json();
    if (!cartData.cartItems || cartData.cartItems.length === 0) {
      throw new Error('Cart is empty');
    }

    console.log(`   Cart has ${cartData.cartItems.length} items`);

    // Update quantity
    const updateResponse = await fetch(`${this.baseURL}/api/cart`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: this.testUserId,
        productId: 1,
        quantity: 3,
      }),
    });

    if (!updateResponse.ok) {
      throw new Error('Update cart failed');
    }
  }

  async testOrderCreation() {
    if (!this.testUserId) {
      throw new Error('No user ID available');
    }

    // Get cart items first
    const cartResponse = await fetch(`${this.baseURL}/api/cart?userId=${this.testUserId}`);
    const cartData = await cartResponse.json();

    if (!cartData.cartItems || cartData.cartItems.length === 0) {
      throw new Error('No items in cart for order');
    }

    // Create order
    const orderData = {
      userId: this.testUserId,
      cartItems: cartData.cartItems,
      totalAmount: 1000, // Mock total
      shippingAddress: '123 Test Street, Lahore, 54000',
      paymentMethod: 'cod',
    };

    const orderResponse = await fetch(`${this.baseURL}/api/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData),
    });

    if (!orderResponse.ok) {
      throw new Error('Order creation failed');
    }

    const orderResult = await orderResponse.json();
    if (!orderResult.success || !orderResult.orderId) {
      throw new Error('Invalid order response');
    }

    console.log(`   Created order: #${orderResult.orderId}`);
  }

  async testProfileUpdate() {
    if (!this.testUserId) {
      throw new Error('No user ID available');
    }

    const updateData = {
      userId: this.testUserId,
      name: 'Updated Test User',
      email: 'test@example.com',
      phone: '+923001234568',
      address: '456 Updated Street',
      city: 'Islamabad',
      postalCode: '44000',
    };

    const response = await fetch(`${this.baseURL}/api/profile`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updateData),
    });

    if (!response.ok) {
      throw new Error('Profile update failed');
    }

    const data = await response.json();
    if (!data.user) {
      throw new Error('Invalid profile update response');
    }

    console.log(`   Updated profile for user: ${data.user.name}`);
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  const runner = new TestRunner();
  runner.runTests().catch(console.error);
}

module.exports = TestRunner;