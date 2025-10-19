import dotenv from "dotenv";
dotenv.config();
import app from "./app";
const PORT = process.env.PORT || 8000;

const startServer = async () => {
    try {
        //connect to database
        // await connectDB();
        // console.log("Connected to the database");
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