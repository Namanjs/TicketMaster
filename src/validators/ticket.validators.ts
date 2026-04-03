import { z } from 'zod';
import mongoose from 'mongoose';

export const buyTicketSchema = z.object({
    eventId: z.string().refine((val) =>
        mongoose.Types.ObjectId.isValid(val), {
        message: "Invalid Event Id format"
    }
    ),
    idempotencyKey: z.string().min(5, "Idempotency Key is required to prevent double charges")
});

export type BuyTicketSchema = z.infer<typeof buyTicketSchema>;