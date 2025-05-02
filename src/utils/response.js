export const handleError = (error, res) => {
    if (error.name === "ZodError") {
        return res.status(400).json({
            status: false,
            message: "Validation error",
            errors: error.errors
        });
    }
    if (error.code === "P2002") {
        return res.status(400).json({
            status: false,
            message: "Email already exists"
        });
    }
    const statusCode = error.message.includes("Invalid") ? 401 :
        error.message.includes("not found") ? 404 : 500;
    return res.status(statusCode).json({
        status: false,
        message: error.message || "Internal server error"
    });
};

// Common success response formatter
export const successResponse = (res, status, message, data = null) => {
    return res.status(status).json({
        status: true,
        message,
        ...(data && { data })
    });
};