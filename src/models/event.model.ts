import mongoose, { Schema, Document, Types } from "mongoose";

export interface IEvent extends Document {
    name: string,
    date: Date,
    price: number,
    totalCapacity: number,
    availableTickets: number,
    organizerId: Types.ObjectId,
    createdAt?: Date
}

const EventSchema: Schema<IEvent> = new Schema({
    name: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true,
        validate: {
            validator: function (value: Date) { // arrow function doesn't have this context so the value here would be undefined
                return value >= new Date(); // must be in future compared to the current time of creation
            },
            message: "Date cannot be in the past"
        }
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    totalCapacity: {
        type: Number,
        required: true,
        min: 1
    },
    availableTickets: {
        type: Number,
        required: true,
        min: 0
    },
    organizerId: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Event = mongoose.model<IEvent>("Event", EventSchema);

export default Event
