import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import User from "../models/user.model.js";
import { loginSchema, login, register, registerSchema } from "../validators/user.validator.js";

const registerUser = asyncHandler(async (req: Request, res: Response) => {
    const validateData: register = registerSchema.parse(req.body);
    const { username, email, password, role } = validateData;

    const isDuplicate = await User.findOne({
        $or: [{email}]
    });

    if(isDuplicate){
        throw new ApiError(409, "User with email already exist.")
    };

    const user = await User.create({
        username: username,
        email: email,
        password: password,
        role: role,
        createdAt: Date.now()
    });

    const createdUser = await User.findById(user._id).select("-password");

    if(!createdUser){
        throw new ApiError(500, "Something went wrong while registering the user.")
    };

    return res.status(201).json(
        new ApiResponse(201, createdUser, "User successfully created.")
    )
});

const loginUser = asyncHandler(async (req: Request, res: Response) => {
    const validateData: login = loginSchema.parse(req.body);
    const { username, email, password } = validateData;

    if (!username && !email) {
        throw new ApiError(400, "Username or email is required to login.");
    };

    const user = await User.findOne({
        $or: [
            ...(username ? [{ username }] : []),
            ...(email ? [{ email }] : [])
        ]
    });

    if (!user) {
        throw new ApiError(404, "User with username or email does not exist.");
    };

    const isPasswordCorrect = await user.isPasswordCorrect(password);

    if (!isPasswordCorrect) {
        throw new ApiError(401, "Password is incorrect.");
    };

    const userResponse = user.toObject();
    delete (userResponse as any).password;

    return res.status(200).json(
        new ApiResponse(200, userResponse, "User logged in successfully.")
    );
});

export{
    registerUser,
    loginUser
}