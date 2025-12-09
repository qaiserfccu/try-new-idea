-- ChiltanPure Seed Data Script
-- This script inserts sample data into existing tables

-- Insert roles (only if they don't exist)
INSERT INTO roles (name) VALUES ('admin'), ('user'), ('manager')
ON CONFLICT (name) DO NOTHING;

-- Insert test users with different roles
-- Password for all test users: "password123"
INSERT INTO users (name, email, password, updated_at) VALUES
    ('Admin User', 'admin@trynewidea.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', NOW()),
    ('Regular User', 'user@trynewidea.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', NOW()),
    ('Manager User', 'manager@trynewidea.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', NOW())
ON CONFLICT (email) DO NOTHING;

-- Insert sample products (ChiltanPure organic products)
INSERT INTO products (name, description, price, original_price, image, category, discount) VALUES
    (
        'Organic Honey',
        'Pure organic honey sourced from the finest beehives in Pakistan. Rich in antioxidants and natural sweetness.',
        1500.00,
        1800.00,
        'honey.jpg',
        'Food & Beverages',
        0
    ),
    (
        'Organic Olive Oil',
        'Extra virgin olive oil, cold-pressed for maximum nutrition. Perfect for cooking and salads.',
        2500.00,
        3000.00,
        'olive.jpg',
        'Food & Beverages',
        0
    ),
    (
        'Natural Face Serum',
        'Organic face serum with vitamin C and hyaluronic acid. Anti-aging and hydrating formula.',
        1800.00,
        2200.00,
        'serum.jpg',
        'Beauty & Skincare',
        0
    ),
    (
        'Herbal Hair Oil',
        'Natural hair oil with coconut, almond, and essential oils. Promotes hair growth and shine.',
        1200.00,
        1500.00,
        'hair.jpg',
        'Hair Care',
        0
    ),
    (
        'Organic Green Tea',
        'Premium green tea leaves from organic farms. Rich in antioxidants and natural flavor.',
        800.00,
        1000.00,
        'tea.jpg',
        'Food & Beverages',
        0
    ),
    (
        'Natural Body Lotion',
        'Hydrating body lotion with shea butter and aloe vera. Non-greasy and fast-absorbing.',
        1400.00,
        1700.00,
        'lotion.jpg',
        'Beauty & Skincare',
        0
    )
ON CONFLICT DO NOTHING;