import Joi from "joi";
import { RequestSchema } from "../middleware/validate";

/**
 * Branch schema organized by request type
 */
export const branchSchemas: Record<string, RequestSchema> = {
    // POST /api/v1/branches - Create new Branch
    create: {
        body: Joi.object({
            name: Joi.string().required().messages({
                "any.required": "Branch name is required",
                "string.empty": "Branch name cannot be empty",
            }),
            address: Joi.string().required().messages({
                "any.required": "Address is required",
                "string.empty": "Address cannot be empty",
            }),
            phone: Joi.string().required().messages({
                "any.required": "Phone is required",
                "string.empty": "Phone cannot be empty",
            }),
        }),
    }, 

    // PUT /api/v1/branches/:id - Update a Branch
    update: {
        params: Joi.object({
            id: Joi.string().required().messages({
                "any.required": "Branch ID is required",
                "string.empty": "Branch ID cannot be empty",
            }),
        }),
        body: Joi.object({
            address: Joi.string().optional().messages({
                "string.empty": "Address cannot be empty",
            }),
            phone: Joi.string().optional().messages({
                "string.empty": "Phone cannot be empty",
            }),
        }),
    },

    // DELETE /api/v1/branches/:id - Delete a Branch
    delete: {
        params: Joi.object({
            id: Joi.string().required().messages({
                "any.required": "Branch ID is required",
                "string.empty": "Branch ID cannot be empty",
            }),
        }),
    },
}