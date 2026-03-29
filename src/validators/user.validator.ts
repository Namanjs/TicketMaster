import { z } from 'zod';

const loginSchema = z.object({
    email: z.string().optional(),
    username: z.string().optional(),
    password: z.string()
});

type login = z.infer<typeof loginSchema>

const registerSchema = z.object({
    username: z
    .string()
    .max(15, "Username must be at most 15 characters long.")
    .min(3, "Username must be atleast 3 characters long.")
    .regex(/^[a-zA-Z][a-zA-Z0-9_]*$/, "Invalid username format"),
    email: z.string().email("Invalid email format."),
    password: z
    .string()
    .min(8, "Password must be atleast 8 characters long."),
    role: z.enum(['BUYER', 'ORGANIZER'])
});

type register = z.infer<typeof registerSchema>

export {
    login,
    loginSchema,
    register,
    registerSchema
}