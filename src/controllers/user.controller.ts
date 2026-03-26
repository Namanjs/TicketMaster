import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import User from "../models/user.model.js";
import { Role } from "../models/user.model.js";

export const registerUser = asyncHandler(async (req: Request, res: Response) => {
    const { username, email, password, role } = req.body;

    const requiredFields = [username, email, password, role];
    const emptyFields: boolean = requiredFields.some((field) => {
        return field === "";
    });

    if (emptyFields) {
        throw new ApiError(400, "All Fields are required.");
    }

    if (username.length <= 3 || username.length > 15) {
        throw new ApiError(400, "Username must be atleast 4 characters and atmost 15 character long.");
    }

    const userRegex = /^[a-zA-Z][a-zA-Z0-9]*$/;
    if (!userRegex.test(username)) {
        throw new ApiError(400, "Username not allowed.")
    };

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        throw new ApiError(400, "Email not allowed.");
    };

    if (password.length < 12) {
        throw new ApiError(400, "Password is too short.")
    }

    if (!Object.values(Role).includes(role)) {
        throw new ApiError(400, "Role doesn't exist.")
    }

    const isDuplicate = await User.findOne({
        email: email
    });
    if (isDuplicate || null) {
        throw new ApiError(409, "User with same email already exist.")
    }

    const user = await User.create({
        username: username.toLowerCase(),
        email: email,
        password: password,
        role: role
    });

    const createduser = await User.findById(user._id).select("-password");

    if (!createduser) {
        throw new ApiError(500, "Something went wrong while registering the user.");
    };

    return res.status(201).json(
        new ApiResponse(201, createduser, "User successfully registered.")
    )
});

