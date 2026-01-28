const mysql = require('mysql2/promise');
require('dotenv').config();

// Hardcoded credentials - ensure password is always set as a string
const DB_PASSWORD = String('Pass@2428');

// Create config object with password set inline (no variables that could be undefined)
const dbConfig = {
  host: process.env.DB_HOST || '127.0.0.1',
  user: process.env.DB_USER || 'root',
  password: DB_PASSWORD, // Explicitly set password
  database: process.env.DB_NAME || 'partnergrid',
  port: Number(process.env.DB_PORT) || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

// Force password to be set - ensure it's never undefined/null/empty
if (!dbConfig.password) {
  dbConfig.password = 'Pass@2428';
}

// Verify password is definitely a string
dbConfig.password = String(dbConfig.password);

// Debug: Log connection config
console.log('=== Database Configuration ===');
console.log('Host:', dbConfig.host);
console.log('User:', dbConfig.user);
console.log('Password:', dbConfig.password ? `SET (${dbConfig.password.length} chars, type: ${typeof dbConfig.password})` : 'NOT SET');
console.log('Password value (first 3 chars):', dbConfig.password ? dbConfig.password.substring(0, 3) + '...' : 'N/A');
console.log('Database:', dbConfig.database);
console.log('Port:', dbConfig.port);
console.log('Config object:', JSON.stringify({ ...dbConfig, password: '***HIDDEN***' }));
console.log('============================');

// Create pool - pass config directly, ensure password is included
const poolConfig = {
  host: dbConfig.host,
  user: dbConfig.user,
  password: dbConfig.password, // Explicitly include password - MUST be set
  database: dbConfig.database,
  port: dbConfig.port,
  waitForConnections: dbConfig.waitForConnections,
  connectionLimit: dbConfig.connectionLimit,
  queueLimit: dbConfig.queueLimit
};

// Double-check password is set before creating pool
if (!poolConfig.password || poolConfig.password === '') {
  console.error('CRITICAL: Password missing in poolConfig!');
  poolConfig.password = '1Consult!'; // Force set it
}

console.log('Pool config password check:', poolConfig.password ? 'SET' : 'NOT SET');
console.log('Pool config keys:', Object.keys(poolConfig));
console.log('Password in poolConfig:', 'password' in poolConfig ? 'YES' : 'NO');

const pool = mysql.createPool(poolConfig);

// Test pool connection immediately
pool.getConnection()
  .then(connection => {
    console.log(`✅ MySQL pool connected successfully!`);
    console.log(`   Host: ${dbConfig.host}, Port: ${dbConfig.port}, Database: ${dbConfig.database}`);
    connection.release();
  })
  .catch(err => {
    console.error('❌ MySQL pool connection error:', err.message);
    console.error('Error code:', err.code);
    console.error('Error details:', err);
    // Don't throw - let the app continue, but log the error
  });

module.exports = pool;

