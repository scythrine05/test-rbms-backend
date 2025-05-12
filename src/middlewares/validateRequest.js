import { handleError } from "../utils/response.js";

/**
 * Middleware for validating requests using Zod schemas
 * @param {Object} schema - Zod schema for validating request
 * @returns {Function} Express middleware
 */
export const validateRequest = (schema) => async (req, res, next) => {
    try {
        // Extract the parts of the request that should be validated
        const dataToValidate = {};

        if (schema.body) dataToValidate.body = req.body;
        if (schema.params) dataToValidate.params = req.params;
        if (schema.query) dataToValidate.query = req.query;

        // Validate the request data against the schema
        const result = await schema.parseAsync(dataToValidate);

        // Update the request with validated data
        if (result.body) req.body = result.body;
        if (result.params) req.params = result.params;
        if (result.query) req.query = result.query;

        next();
    } catch (error) {
        console.log(error);
        // Handle Zod validation errors
        if (error.errors) {
            const validationErrors = error.errors.map(err => ({
                path: err.path.join('.'),
                message: err.message
            }));

            // Create a custom error with validation details
            const validationError = new Error("Validation Error");
            validationError.statusCode = 400;
            validationError.errors = validationErrors;

            return handleError(validationError, res);
        }

        handleError(error, res);
    }
};
