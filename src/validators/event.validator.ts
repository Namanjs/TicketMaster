import { z } from 'zod';

const createEventSchema = z.object({
    name: z.string().min(3, "Name must be atleast 3 characters long."),
    date: z.coerce.date(),
    price: z.number().min(0, "Price cannot be negative."),
    totalCapacity: z.number().min(1)
});

type create_Event = z.infer<typeof createEventSchema>

export {
    create_Event,
    createEventSchema
}