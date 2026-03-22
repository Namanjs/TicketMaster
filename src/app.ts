import express, { Request, Response } from 'express';
import cors from 'cors';

export const app = express();

app.use(cors({
    origin: "*",
    credentials: true,
}));

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.get('/', (req: Request, res: Response): void => {
    res.send("TicketMaster App is Working.")
})