//# DB connection setup (PostgreSQL)
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export const connectDB = async () :Promise<void>=> {
  try{
    const client = await pool.connect();
    console.log('Database connection test successful');
    client.release();
    await initializeTables();
  }catch (error) {
    console.error('Database connection test failed', error);
  }
};
const initializeTables = async (): Promise<void> => {
  const client = await pool.connect();
  try {
    //can create table here if not exists
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        username VARCHAR(50) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `);
      //create indexes
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)
    `);
    
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_users_username ON users(username)
    `);
    await client.query(`
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = NOW();
        RETURN NEW;
      END;
      $$ language 'plpgsql'
    `);
    await client.query(`
      DROP TRIGGER IF EXISTS update_users_updated_at ON users;
      CREATE TRIGGER update_users_updated_at
        BEFORE UPDATE ON users
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column()
    `);
  } catch (error) {
    console.error('Error initializing tables', error);
  } finally {
    client.release();
  }
};
export const closeDB = async (): Promise<void> => {
  try {
    await pool.end();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Error closing database connection', error);
  }
};

export default pool;