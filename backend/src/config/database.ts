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
    //can create table here
    
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