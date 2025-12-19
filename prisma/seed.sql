-- ChiltanPure Seed Data Script
-- This script inserts sample data into existing tables

-- Insert roles (only if they don't exist)
-- Insert roles (only if they don't exist) and ensure updated_at is set for older schemas
INSERT INTO roles (name, updated_at) VALUES ('admin', NOW()), ('user', NOW()), ('manager', NOW())
ON CONFLICT (name) DO NOTHING;

-- Insert test users with different roles
-- Password for all test users: "password123"
-- Insert users and link to existing roles by name (works regardless of role IDs)
INSERT INTO users (name, email, password, phone, role_id, updated_at) VALUES
        (
            'Admin User',
            'admin@trynewidea.com',
            '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
            '+92 300 1111111',
            (SELECT id FROM roles WHERE name = 'admin'),
            NOW()
        ),
        (
            'Regular User',
            'user@trynewidea.com',
            '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
            '+92 300 2222222',
            (SELECT id FROM roles WHERE name = 'user'),
            NOW()
        ),
        (
            'Manager User',
            'manager@trynewidea.com',
            '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
            '+92 300 3333333',
            (SELECT id FROM roles WHERE name = 'manager'),
            NOW()
        )
ON CONFLICT (email) DO NOTHING;

-- Insert sample products (ChiltanPure organic products)
INSERT INTO products (name, description, price, original_price, image, category, discount) VALUES
-- Insert sample products (ChiltanPure organic products)
-- Use correct column names for the current schema and set updated_at so seeding works on older schemas
INSERT INTO products (name, description, price, original_price, chiltanpure_url, images, category, stock, is_available, updated_at) VALUES
    (
        'Organic Honey',
        'Pure organic honey sourced from the finest beehives in Pakistan. Rich in antioxidants and natural sweetness.',
        1500.00,
        1800.00,
        'https://chiltanpure.com/products/organic-honey?bg_ref=XEUldZfjcO',
        ARRAY['https://chiltanpure.com/cdn/shop/products/organic-honey.jpg'],
        'Food & Beverages',
        50,
        TRUE,
        NOW()
    ),
    (
        'Organic Olive Oil',
        'Extra virgin olive oil, cold-pressed for maximum nutrition. Perfect for cooking and salads.',
        2500.00,
        3000.00,
        'https://chiltanpure.com/products/olive-oil?bg_ref=XEUldZfjcO',
        ARRAY['https://chiltanpure.com/cdn/shop/products/olive-oil.jpg'],
        'Food & Beverages',
        30,
        TRUE,
        NOW()
    ),
    (
        'Natural Face Serum',
        'Organic face serum with vitamin C and hyaluronic acid. Anti-aging and hydrating formula.',
        1800.00,
        2200.00,
        'https://chiltanpure.com/products/face-serum?bg_ref=XEUldZfjcO',
        ARRAY['https://chiltanpure.com/cdn/shop/products/face-serum.jpg'],
        'Beauty & Skincare',
        40,
        TRUE,
        NOW()
    ),
    (
        'Herbal Hair Oil',
        'Natural hair oil with coconut, almond, and essential oils. Promotes hair growth and shine.',
        1200.00,
        1500.00,
        'https://chiltanpure.com/products/hair-oil?bg_ref=XEUldZfjcO',
        ARRAY['https://chiltanpure.com/cdn/shop/products/hair-oil.jpg'],
        'Hair Care',
        60,
        TRUE,
        NOW()
    ),
    (
        'Organic Green Tea',
        'Premium green tea leaves from organic farms. Rich in antioxidants and natural flavor.',
        800.00,
        1000.00,
        'https://chiltanpure.com/products/green-tea?bg_ref=XEUldZfjcO',
        ARRAY['https://chiltanpure.com/cdn/shop/products/green-tea.jpg'],
        'Food & Beverages',
        100,
        TRUE,
        NOW()
    ),
    (
        'Natural Body Lotion',
        'Hydrating body lotion with shea butter and aloe vera. Non-greasy and fast-absorbing.',
        1400.00,
        1700.00,
        'https://chiltanpure.com/products/body-lotion?bg_ref=XEUldZfjcO',
        ARRAY['https://chiltanpure.com/cdn/shop/products/body-lotion.jpg'],
        'Beauty & Skincare',
        45,
        TRUE,
        NOW()
    )
ON CONFLICT DO NOTHING;