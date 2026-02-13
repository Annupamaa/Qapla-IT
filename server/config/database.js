const mysql = require("mysql2/promise");
require("dotenv").config();

const DB_PASSWORD = String("Pass@2428");

const dbConfig = {
  host: process.env.DB_HOST || "127.0.0.1",
  user: process.env.DB_USER || "root",
  password: DB_PASSWORD,
  database: process.env.DB_NAME || "partnergrid",
  port: Number(process.env.DB_PORT) || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

if (!dbConfig.password) {
  dbConfig.password = "Pass@2428";
}

dbConfig.password = String(dbConfig.password);

console.log("=== Database Configuration ===");
console.log("Host:", dbConfig.host);
console.log("User:", dbConfig.user);
console.log(
  "Password:",
  dbConfig.password
    ? `SET (${dbConfig.password.length} chars, type: ${typeof dbConfig.password})`
    : "NOT SET",
);
console.log(
  "Password value (first 3 chars):",
  dbConfig.password ? dbConfig.password.substring(0, 3) + "..." : "N/A",
);
console.log("Database:", dbConfig.database);
console.log("Port:", dbConfig.port);
console.log(
  "Config object:",
  JSON.stringify({ ...dbConfig, password: "***HIDDEN***" }),
);
console.log("============================");

const poolConfig = {
  host: dbConfig.host,
  user: dbConfig.user,
  password: dbConfig.password,
  database: dbConfig.database,
  port: dbConfig.port,
  waitForConnections: dbConfig.waitForConnections,
  connectionLimit: dbConfig.connectionLimit,
  queueLimit: dbConfig.queueLimit,
};

if (!poolConfig.password || poolConfig.password === "") {
  console.error("CRITICAL: Password missing in poolConfig!");
  poolConfig.password = "Pass@2428";
}

console.log(
  "Pool config password check:",
  poolConfig.password ? "SET" : "NOT SET",
);
console.log("Pool config keys:", Object.keys(poolConfig));
console.log("Password in poolConfig:", "password" in poolConfig ? "YES" : "NO");

const pool = mysql.createPool(poolConfig);

pool
  .getConnection()
  .then((connection) => {
    console.log(`✅ MySQL pool connected successfully!`);
    console.log(
      `   Host: ${dbConfig.host}, Port: ${dbConfig.port}, Database: ${dbConfig.database}`,
    );
    connection.release();
  })
  .catch((err) => {
    console.error("❌ MySQL pool connection error:", err.message);
    console.error("Error code:", err.code);
    console.error("Error details:", err);
  });

module.exports = pool;
