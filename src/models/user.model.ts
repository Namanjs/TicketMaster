import bcrypt from "bcryptjs";
import mongoose, { Schema, Document } from "mongoose";
import jwt, { SignOptions } from 'jsonwebtoken';

export enum Role {
    BUYER = "BUYER",
    ORGANIZER = 'ORGANIZER'
}

export interface IUser extends Document {
    username: string;
    email: string;
    password: string;
    role: Role;
    createdAt?: Date;
    refresh_token?: string;
    isPasswordCorrect(password: string): Promise<boolean>;
    generateAccessToken(): string;
    generateRefreshToken(): string
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
    },
    refresh_token: {
        type: String
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

UserSchema.methods.generateAccessToken = function(): string {
    type StringValue = `${number}${'s' | 'm' | 'h' | 'd' | 'w' | 'y'}`;

    const expiry = (process.env.ACCESS_TOKEN_EXPIRY || "1d") as StringValue;

    const options: SignOptions = {
        expiresIn: expiry
    };

    return jwt.sign(
        { _id: this._id, username: this.username, email: this.email, role: this.role },
        process.env.ACCESS_TOKEN_SECRET as string,
        options
    );
};

UserSchema.methods.generateRefreshToken = function(): string {
    type StringValue = `${number}${'s' | 'm' | 'h' | 'd' | 'w' | 'y'}`;

    const expiry = (process.env.ACCESS_TOKEN_EXPIRY || "1d") as StringValue;

    const options: SignOptions = {
        expiresIn: expiry
    };

    return jwt.sign(
        { _id: this._id },
        process.env.REFRESH_TOKEN_SECRET as string,
        options
    );
};

const User = mongoose.model<IUser>('User', UserSchema);

export default User;