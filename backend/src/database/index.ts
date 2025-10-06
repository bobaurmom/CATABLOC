// Database connection and query utilities
//  Implement database connection logic

// const { Client } = require("pg");

export interface DatabaseConfig {
  host: string;
  port: number;
  database: string;
  username: string;
  password: string;
}
