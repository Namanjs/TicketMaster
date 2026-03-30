import mongoose from 'mongoose';
import { z } from 'zod';

const createEventSchema = z.object({
    name: z.string().min(3, "Name must be atleast 3 characters long."),
    date: z.coerce.date(),
    price: z.number().min(0, "Price cannot be negative."),
    totalCapacity: z.number().min(1)
});

type create_Event = z.infer<typeof createEventSchema>

const eventIdFromParamsSchema = z.object({
    eventId: z.string().refine((val) => 
        mongoose.Types.ObjectId.isValid(val),
        {
            message: "Invalid MongoDB ObjectId."
        }
    )
});

type IdParam = z.infer<typeof eventIdFromParamsSchema>;

export {
    create_Event,
    createEventSchema,
    IdParam,
    eventIdFromParamsSchema
}