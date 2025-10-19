import express from 'express';
import cors from 'cors';
import swaggerUi from "swagger-ui-express";
import swaggerDocs from './config/swagger';
import helmet from 'helmet';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import { NotFoundHandler ,errorHandler} from './middleware/auth';
import authRoutes from './routes/auth.routes';

const app = express();
app.use(helmet());
dotenv.config();

app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'CATABLOC API is running',
        version: '1.0.0'
    })
});

app.use(cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    allowedHeaders: 'Content-Type,Authorization'
}));

// serve swagger docs before 404 handler remember that
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

//rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max:100, // limit each IP to 100 requests per windowMs
    message: {
        success: false,
        message: 'Too many requests from this IP, please try again later.'
    }, standardHeaders: true,
    legacyHeaders: false,
});
app.use(limiter);

const authlimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max:5, // only 5 attempts per IP
    message: {
        success: false,
        message: 'Too many login/register attempts from this IP, please try again later.'
    }, standardHeaders: true,
    legacyHeaders: false,
});
app.use('/api/auth', authlimiter , authRoutes);
// error handlers should be last learn it the hard way ngl
app.use(NotFoundHandler);
app.use(errorHandler);

export default app;