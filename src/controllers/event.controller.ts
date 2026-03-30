import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { create_Event, createEventSchema, eventIdFromParamsSchema, IdParam } from "../validators/event.validator.js";
import { Role } from "../models/user.model.js";
import Event from "../models/event.model.js";

const createEvent = asyncHandler(async (req: Request, res: Response) => {
    const user = req.user;

    if (user?.role !== Role.ORGANIZER) {
        throw new ApiError(403, "Not allowed to create event.")
    };

    const validatedData: create_Event = await createEventSchema.parseAsync(req.body);
    const { name, date, price, totalCapacity } = validatedData;

    const isDuplicate = await Event.findOne({
        $and: [{ name }, { date }, { organizerId: user._id }]
    });

    if (isDuplicate) {
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

    if (!createdEvent) {
        throw new ApiError(500, "Something went wrong while registering the event.")
    };

    return res.status(201).json(
        new ApiResponse(201, createdEvent, "Event successfully created.")
    )
});

const getAllEvent = asyncHandler(async (req: Request, res: Response) => {
    const upcomingEvents = await Event.find({
        date: {
            $gte: new Date()
        }
    })
    .sort({ date: 1 })
    .select("name date price totalCapacity availableTickets -_id");

    return res.status(200).json(
        new ApiResponse(200, upcomingEvents, "Upcoming events fetched successfully.")
    )
});

const getEventById = asyncHandler( async (req: Request, res: Response) => {
    const validateId: IdParam = await eventIdFromParamsSchema.parse(req.params);
    
    const { eventId } = validateId;

    const event = await Event.findById(eventId).select("-organizerId");

    if(!event) {
        throw new ApiError(404, "Event with this Id does not exist.")
    };

    return res.status(200).json(
        new ApiResponse(200, event, "Event successfully fetched.")
    );
});

export {
    createEvent,
    getAllEvent,
    getEventById
}