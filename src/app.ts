import express, { Request, Response } from 'express';
import cors from 'cors';
import { errorHandler } from './middlewares/error.middleware.js';
import userRoutes from './routes/user.routes.js';
import eventRoutes from './routes/event.routes.js';
import ticketRoutes from './routes/ticket.routes.js';
import cookieParser from 'cookie-parser';

export const app = express();

app.use(cors({
    origin: "*",
    credentials: true,
}));

app.use(cookieParser());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.get('/', (req: Request, res: Response): void => {
    res.send("TicketMaster App is Working.")
})

app.use("/api/v1/users",userRoutes);

app.use("/api/v1/events",eventRoutes);

app.use("/api/v1/tickets",ticketRoutes);

app.use(errorHandler);