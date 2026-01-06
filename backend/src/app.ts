import 'dotenv/config' // Must be first!
import express from 'express';
import cors from 'cors';
import swaggerUi from "swagger-ui-express";
import swaggerDocs from './config/swagger';
import helmet from 'helmet';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import { NotFoundHandler ,errorHandler} from './middleware/auth';
import authRoutes from './routes/auth.routes';
import gameRoutes from './routes/game.routes';
import dashboardRoutes from './routes/dashboard.routes';


import cookieParser from 'cookie-parser';
dotenv.config(); //load env

const app = express(); 

app.use(cookieParser());
app.use(express.json()); //parse json body
app.use((req, res, next) => {
  console.log(`REQ: ${req.method} ${req.url}`);
  next();
});
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'CATABLOC API is running',
        version: '1.0.0'
    })
});

//CORS middleware cors is used to allow requests between frontend and backend
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000', 
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    allowedHeaders: 'Content-Type,Authorization'
}));

// serve swagger docs before 404 handler remember that
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

//rate limiting for all routes to prevent DDoS attacks but idk if it work tbh (just copy paste from stackoverflow)
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max:200, // limit each IP to 200 requests per windowMs
    message: {
        success: false,
        message: 'Too many requests from this IP, please try again later.'
    }, standardHeaders: true,
    legacyHeaders: false,
});
app.use(limiter);
// limit login and register routes cannot be brute forced not 100% secure tho but better than nothing
const authlimiter = rateLimit({
    windowMs: 15 * 60 * 10000, // 15 minutes
    max:100, // only 5 attempts per IP
    message: {
        success: false,
        message: 'Too many login/register attempts from this IP, please try again later.'
    }, standardHeaders: true,
    legacyHeaders: false,
});

app.use('/api/auth', authlimiter , authRoutes);
//API routes
app.use('/api/games', gameRoutes);
app.use('/api/dashboard', dashboardRoutes);
// error handlers should be last learn it the hard way ngl
app.use(NotFoundHandler); //404 handler
app.use(errorHandler); //general error handler

export default app;