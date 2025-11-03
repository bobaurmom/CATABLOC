import { Sequelize } from "sequelize";
import dotenv from "dotenv";
import { tr } from "zod/locales";

dotenv.config();
const sequelize = new Sequelize(process.env.DATABASE_URL as string, {
    dialect: 'postgres',
    logging: process.env.NODE_ENV === 'development' ? console.log : true,
    pool: {
        max: 20,
        min: 5,
        acquire: 30000,
        idle: 10000
    },
});
export const connectDB = async (): Promise<void> => {
    try {
        await sequelize.authenticate();
        console.log('Sequelize: Database connection established successfully.');
        
        // In development, force recreate tables to ensure schema matches exactly
        if (process.env.NODE_ENV === 'development') {
            console.log('Development mode: force-recreating tables to match model definitions...');
            // Drop all tables and recreate from models
            await sequelize.sync();
            console.log('Sequelize: Tables dropped and recreated successfully.');
        } else {
            // In production, use safe sync with alter
            console.log('Production mode: safely syncing models...');
            await sequelize.sync({ alter: true });
        }
        console.log('Sequelize: Models synchronized successfully.');
    } catch (error) {
        console.error('Sequelize: Unable to connect to the database:', error);
        throw error;
    }
};
export const closeDB = async (): Promise<void> => {
    try {
        await sequelize.close();    
        console.log('Sequelize: Database connection closed.');
    } catch (error) {
        console.error('Sequelize: Error closing database connection:', error);
    }       
};

export default sequelize;