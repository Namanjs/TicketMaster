import mongoose, { Schema, Document } from "mongoose";

export enum Role {
    BUYER = "BUYER",
    ORGANIZER = 'ORGANIZER'
}

export interface IUser extends Document {
    username: string,
    email: string,
    password: string,
    role: Role,
    createdAt?: Date
}

const UserSchema: Schema<IUser> = new Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: Object.values(Role),
        default: Role.BUYER
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const User = mongoose.model<IUser>('User', UserSchema);

export default User;