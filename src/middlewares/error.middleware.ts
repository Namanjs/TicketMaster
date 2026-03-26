import { ApiError } from "../utils/ApiError.js";
import { Request, Response, NextFunction } from "express";

const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    let error = err;

    if(!(error instanceof ApiError)){
        const statusCode = error.statusCode || 500;
        const message = error.message || "Something went wrong";
        error = new ApiError(statusCode, message, error?.errors || [],err.stack )
    }

    const response = {
        ...error,
        message: error.message, // message don't show up when done (...error), we force it to appear
        ...(process.env.NODE_ENV === "development" ? { stack: error.stack } : {})
    }

    return res.status(error.statusCode).json(response);
}

export { errorHandler }