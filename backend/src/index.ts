
import dotenv from "dotenv";
import { connectDB as connectSequelize } from "./config/sequelize";
dotenv.config();
import app from "./app";
const PORT = process.env.PORT || 8000;

const startServer = async () => {
    try {
    // connect using Sequelize so models are synced (creates/updates tables in development)
    await connectSequelize();
    console.log("Connected to the database (sequelize)");
        //start the local host
        app.listen(PORT, () => {
            console.log(`Server is running on port http://localhost:${PORT}`);
            console.log(`API docs running at http://localhost:${PORT}/api-docs`);
        });
    } catch (error) {
        console.error("Error starting server:", error);
    }
};
startServer();