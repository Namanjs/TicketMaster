class ApiError extends Error{
    public statusCode: number;
    public message: string;
    public data: any | null;
    public errors: any[];
    public success: boolean;

    constructor(statusCode: number, message: string = "Something went wrong",  data: any | null, errors: any[]){
        super(message)
        this.statusCode = statusCode,
        this.data = null,
        this.message = message,
        this.success = false,
        this.errors = errors
    }
}

export { ApiError }