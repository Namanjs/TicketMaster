import mongoose, { Schema, Document, Types } from "mongoose";

export enum Status {
    VALID = "VALID",
    CANCELLED = "CANCELLED",
    USED = "USED"
}

export interface ITicket extends Document {
    eventId: Types.ObjectId,
    userId: Types.ObjectId,
    ticketCode: string,
    purchasePrice: number,
    status: Status,
    createdAt?: Date
}

const TicketSchema: Schema<ITicket> = new Schema({
    eventId: {
        type: Schema.Types.ObjectId,
        ref: "Event"
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    ticketCode: {
        type: String,
        required: true,
        unique: true
    },
    purchasePrice: {
        type: Number,
        required: true,
        min: 0
    },
    status: {
        type: String,
        enum: Object.values(Status),
        default: Status.VALID 
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Ticket = mongoose.model<ITicket>("Ticket", TicketSchema);

export default Ticket;