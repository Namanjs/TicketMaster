import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { create_Event, createEventSchema } from "../validators/event.validator.js";
import { Role } from "../models/user.model.js";
import Event from "../models/event.model.js";

const createEvent = asyncHandler( async (req: Request, res: Response) => {
    const user = req.user;

    if(user?.role !== Role.ORGANIZER){
        throw new ApiError(403, "Not allowed to create event.")
    };

    const validatedData: create_Event = await createEventSchema.parseAsync(req.body);
    const { name, date, price, totalCapacity} = validatedData;

    const isDuplicate = await Event.findOne({
        $and: [{name}, {date}, {organizerId: user._id}]
    });

    if(isDuplicate){
        throw new ApiError(409, "Event already exist.")
    };

    const event = await Event.create({
        name: name,
        date: date,
        price: price,
        totalCapacity: totalCapacity,
        availableTickets: totalCapacity,
        organizerId: user._id
    });

    const createdEvent = await Event.findById(event._id);

    if(!createdEvent){
        throw new ApiError(500, "Something went wrong while registering the event.")
    };

    return res.status(201).json(
        new ApiResponse(201, createdEvent, "Event successfully created.")
    )
});

export {
    createEvent
}