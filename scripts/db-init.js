#!/usr/bin/env node

// Database initialization script
// This script loads the .env file and runs the database initialization SQL

require('dotenv').config({ path: '.env' });

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.error('DATABASE_URL not found in .env file');
  process.exit(1);
}

try {
  console.log('Initializing database...');

  // Run the main initialization script (table creation)
  const initSqlPath = path.join(__dirname, '..', 'prisma', 'init.sql');
  if (fs.existsSync(initSqlPath)) {
    console.log('Creating tables...');
    try {
      execSync(`psql "${databaseUrl}" -f "${initSqlPath}"`, {
        stdio: 'inherit',
        env: { ...process.env, DATABASE_URL: databaseUrl }
      });
    } catch (error) {
      console.log('Table creation completed with some warnings (tables may already exist)');
    }
  }

  // Run the seed script (data insertion)
  const seedSqlPath = path.join(__dirname, '..', 'prisma', 'seed.sql');
  if (fs.existsSync(seedSqlPath)) {
    console.log('Seeding database...');
    execSync(`psql "${databaseUrl}" -f "${seedSqlPath}"`, {
      stdio: 'inherit',
      env: { ...process.env, DATABASE_URL: databaseUrl }
    });
  }

  console.log('Database initialization completed successfully!');
} catch (error) {
  console.error('Database initialization failed:', error.message);
  process.exit(1);
}