import { app } from './app.js';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

const port = Number(process.env.PORT) || 8000;
const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/ticketMaster_lite';

mongoose
    .connect(mongoUri)
    .then(() : void => {
        console.log("Connected to MongoDB");

        app.listen(port, (): void => {
            console.log(`Server is running at http://localhost:${port}`)
        });
    })
    .catch((error: Error): void => {
        console.error("Error connecting to MongoDB: ", error);
        process.exit(1);
    })