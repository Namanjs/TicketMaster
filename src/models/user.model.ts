import bcrypt from "bcryptjs";
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

UserSchema.pre<IUser>('save', async function(next) {
    if(!this.isModified('password')){
        return next();
    }

    this.password = await bcrypt.hash(this.password, 12);
    next();
});

UserSchema.methods.isPasswordCorrect = async function(password: string): Promise<boolean> {
    return await bcrypt.compare(password, this.password);
};

const User = mongoose.model<IUser>('User', UserSchema);

export default User;