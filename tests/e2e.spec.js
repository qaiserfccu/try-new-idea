const { test, expect } = require('@playwright/test');

test.describe('ChiltanPure E2E Tests', () => {
  test('should load homepage and display products', async ({ page }) => {
    await page.goto('http://localhost:3001');

    // Check if the homepage loads
    await expect(page).toHaveTitle(/ChiltanPure/);

    // Check if products are displayed
    const productsSection = page.locator('[data-testid="products-section"]');
    await expect(productsSection).toBeVisible();

    // Check if at least one product is visible
    const productCards = page.locator('[data-testid="product-card"]');
    await expect(productCards.first()).toBeVisible();
  });

  test('should allow user registration', async ({ page }) => {
    await page.goto('http://localhost:3001/login');

    // Click on signup link or navigate to signup
    const signupLink = page.locator('a[href*="signup"]').or(page.locator('text=Sign Up'));
    if (await signupLink.isVisible()) {
      await signupLink.click();
    } else {
      await page.goto('http://localhost:3001/signup');
    }

    // Fill registration form
    await page.fill('input[name="name"]', 'Test User');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'password123');
    await page.fill('input[name="phone"]', '+923001234567');

    // Submit form
    await page.click('button[type="submit"]');

    // Check if redirected to profile or success message
    await expect(page).toHaveURL(/\/profile|\/$/);
  });

  test('should allow user login', async ({ page }) => {
    await page.goto('http://localhost:3001/login');

    // Fill login form
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'password123');

    // Submit form
    await page.click('button[type="submit"]');

    // Check if redirected to profile or homepage
    await expect(page).toHaveURL(/\/profile|\/$/);
  });

  test('should allow adding products to cart', async ({ page }) => {
    // First login
    await page.goto('http://localhost:3001/login');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');

    // Navigate to products
    await page.goto('http://localhost:3001');

    // Find and click add to cart button on first product
    const addToCartButton = page.locator('[data-testid="add-to-cart"]').first();
    await addToCartButton.click();

    // Check if cart has items
    const cartCount = page.locator('[data-testid="cart-count"]');
    await expect(cartCount).toHaveText('1');
  });

  test('should allow viewing cart', async ({ page }) => {
    // Login first
    await page.goto('http://localhost:3001/login');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');

    // Navigate to cart
    await page.goto('http://localhost:3001/cart');

    // Check if cart page loads
    await expect(page).toHaveURL('/cart');

    // Check if cart items are displayed
    const cartItems = page.locator('[data-testid="cart-item"]');
    await expect(cartItems.first()).toBeVisible();
  });

  test('should allow checkout process', async ({ page }) => {
    // Login first
    await page.goto('http://localhost:3001/login');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');

    // Add item to cart first
    await page.goto('http://localhost:3001');
    const addToCartButton = page.locator('[data-testid="add-to-cart"]').first();
    await addToCartButton.click();

    // Navigate to checkout
    await page.goto('http://localhost:3001/checkout');

    // Fill checkout form
    await page.fill('input[name="name"]', 'Test User');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="phone"]', '+923001234567');
    await page.fill('input[name="address"]', '123 Test Street');
    await page.fill('input[name="city"]', 'Lahore');
    await page.fill('input[name="postalCode"]', '54000');

    // Select payment method
    await page.check('input[name="payment"][value="cod"]');

    // Submit order
    await page.click('button[type="submit"]');

    // Check if order success message appears
    const successMessage = page.locator('text=Order placed successfully');
    await expect(successMessage).toBeVisible();
  });

  test('should allow profile management', async ({ page }) => {
    // Login first
    await page.goto('http://localhost:3001/login');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');

    // Navigate to profile
    await page.goto('http://localhost:3001/profile');

    // Check if profile page loads
    await expect(page).toHaveURL('/profile');

    // Update profile information
    await page.fill('input[name="phone"]', '+923001234568');
    await page.fill('input[name="address"]', '456 Updated Street');
    await page.fill('input[name="city"]', 'Islamabad');

    // Submit form
    await page.click('button[type="submit"]');

    // Check for success message
    const successMessage = page.locator('text=Profile updated successfully');
    await expect(successMessage).toBeVisible();
  });
});