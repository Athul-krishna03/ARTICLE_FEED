import "reflect-metadata";
import express, { Application } from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors'
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { connectDB } from './config/database';
import AuthRoutes from './routes/authRoutes';
import UserRoutes from "./routes/userRoutes";
// import userRoutes from './routes/user.routes';
dotenv.config()
connectDB();

const app: Application = express();
app.use(cookieParser());
app.use(helmet())
app.use(morgan('dev'))
app.use(express.json());
app.use(cors({
    origin: process.env.ALLOWED_ORGIN,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Authorization", "Content-Type"],
    credentials: true,
}))
app.use('/', AuthRoutes);
app.use('/articles',UserRoutes)

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

