import { Request, Response } from "express";
import mongoose from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import Event from "../models/event.model.js";
import Ticket, { Status } from "../models/ticket.model.js";
import { buyTicketSchema, BuyTicketSchema } from "../validators/ticket.validators.js";

const buyTicket = asyncHandler(async (req: Request, res: Response) => {
    const validateData: BuyTicketSchema = await buyTicketSchema.parseAsync(req.body);
    const { eventId, idempotencyKey } = validateData;
    const userId = req.user?._id;

    if (!userId) {
        throw new ApiError(401, "Unauthorized");
    }

    const session = await mongoose.startSession();
    session.startTransaction({
        readConcern: { level: "snapshot" },
        writeConcern: { w: "majority" }
    });

    try {
        const event = await Event.findById(eventId).session(session);

        if (!event) {
            throw new ApiError(400, "Event does not exist.");
        }

        if (event.availableTickets < 1) {
            throw new ApiError(400, "Sold Out.");
        }

        const ticket = await Ticket.create([{
            eventId: eventId,
            userId: userId,
            ticketCode: `TKT-${Date.now()}-${Math.floor(Math.random() * 1000)}`, purchasePrice: event.price,
            status: Status.VALID,
            idempotencyKey: idempotencyKey,
            createdAt: Date.now()
        }], { session });

        const updateEvent = await Event.findByIdAndUpdate(
            eventId,
            {
                $inc: {
                    availableTickets: -1
                }
            },
            {
                new: true,
                session: session
            }
        );

        if (!updateEvent) {
            throw new ApiError(500, "Error while updating event information.")
        }

        await session.commitTransaction();

        return res.status(201).json(
            new ApiResponse(201, ticket, "Ticket successfully created.")
        )
    } catch (error: any) {
        await session.abortTransaction();

        if (error.code === 11000) {
            throw new ApiError(409, "This transaction has already been processed");
        };

        throw error;
    } finally {
        session.endSession()
    }
});

const getUserTickets = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user._id;

    if(!userId) {
        throw new ApiError(401, "Unauthorized");
    }

    const tickets = await Ticket.find({
        userId: userId
    }).populate("eventId", "name date").sort({ createdAt: -1 });

    return res.status(200).json(
        new ApiResponse(200, tickets, "User tickets fetched successfully.")
    );
});

export{ 
    buyTicket,
    getUserTickets
};