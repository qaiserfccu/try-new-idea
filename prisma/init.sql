-- ChiltanPure Database Initialization Script
-- This script creates the initial database structure and seed data

-- Create roles table
CREATE TABLE IF NOT EXISTS roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    address TEXT,
    city VARCHAR(100),
    postal_code VARCHAR(20),
    role_id INTEGER DEFAULT 2,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (role_id) REFERENCES roles(id)
);

-- Create products table
CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    original_price DECIMAL(10, 2),
    chiltanpure_url VARCHAR(500),
    images VARCHAR(500)[],
    category VARCHAR(100),
    stock INTEGER DEFAULT 0,
    is_available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    payment_method VARCHAR(50) NOT NULL,
    shipping_address TEXT NOT NULL,
    tracking_number VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Create order_items table
CREATE TABLE IF NOT EXISTS order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    quantity INTEGER NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
);

-- Insert roles
INSERT INTO roles (name) VALUES ('admin'), ('user'), ('manager')
ON CONFLICT (name) DO NOTHING;

-- Insert test users with different roles
-- Password for all test users: "password123"
INSERT INTO users (name, email, password, phone, role_id) VALUES
    ('Admin User', 'admin@trynewidea.com', 'Admin123', '+92 300 1111111', 1),
    ('Regular User', 'user@trynewidea.com', 'User123', '+92 300 2222222', 2),
    ('Manager User', 'manager@trynewidea.com', 'Manager123', '+92 300 3333333', 3)
ON CONFLICT (email) DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role_id ON users(role_id);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON order_items(product_id);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);

-- Insert sample products (ChiltanPure organic products)
INSERT INTO products (name, description, price, original_price, chiltanpure_url, images, category, stock, is_available) VALUES
    (
        'Organic Honey',
        'Pure organic honey sourced from the finest beehives in Pakistan. Rich in antioxidants and natural sweetness.',
        1500.00,
        1800.00,
        'https://chiltanpure.com/products/organic-honey?bg_ref=XEUldZfjcO',
        ARRAY['https://chiltanpure.com/cdn/shop/products/organic-honey.jpg'],
        'Food & Beverages',
        50,
        TRUE
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
        TRUE
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
        TRUE
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
        TRUE
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
        TRUE
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
        TRUE
    )
ON CONFLICT DO NOTHING;

-- Create product_variants table
CREATE TABLE IF NOT EXISTS product_variants (
    id SERIAL PRIMARY KEY,
    product_id INTEGER NOT NULL,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    stock INTEGER DEFAULT 0,
    is_available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- Create cart_items table
CREATE TABLE IF NOT EXISTS cart_items (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    variant_id INTEGER,
    quantity INTEGER DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (variant_id) REFERENCES product_variants(id) ON DELETE CASCADE
);

-- Create indexes for cart and variants
CREATE INDEX IF NOT EXISTS idx_product_variants_product_id ON product_variants(product_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_user_id ON cart_items(user_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_product_id ON cart_items(product_id);

