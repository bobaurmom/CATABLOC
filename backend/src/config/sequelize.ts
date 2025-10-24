import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();
const sequelize = new Sequelize(process.env.DATABASE_URL as string, {
    dialect: 'postgres',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
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
        await sequelize.sync({ alter: process.env.NODE_ENV === 'development' }); //sync models to db only in dev
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