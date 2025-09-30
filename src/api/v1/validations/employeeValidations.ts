import Joi from "joi";

/**
 * Employee schema organized by request type
 */
export const employeeSchemas = {
    // POST /api/v1/employees - Create new Employee
    create: {
        body: Joi.object({
            name: Joi.string().required().messages({
                "any.required": "Name is required",
                "string.empty": "Name cannot be empty",
            }),
            position: Joi.string().required().messages({
                "any.required": "Position is required",
                "string.empty": "Position cannot be empty",
            }),
            department: Joi.string().required().messages({
                "any.required": "Department is required",
                "string.empty": "Department cannot be empty",
            }),
            email: Joi.string().required().messages({
                "any.required": "Email is required",
                "string.empty": "Email cannot be empty",
            }),
            phone: Joi.string().required().messages({
                "any.required": "Phone is required",
                "string.empty": "Phone cannot be empty",
            }),
            branchId: Joi.number().required().min(0).messages({
                "number.min": "Branch ID must greater than 0",
                "string.empty": "Branch ID cannot be empty",
            }),
        }),
    },

    // PUT /api/v1/employees/:id - Update an Employee
    update: {
        params: Joi.object({
            id: Joi.string().required().messages({
                "any.required": "Employee ID is required",
                "string.empty": "Employee ID cannot be empty",
            }),
        }),
        body: Joi.object({
            position: Joi.string().optional().messages({
                "string.empty": "Position cannot be empty",
            }),
            phone: Joi.string().optional().messages({
                "string.empty": "Phone cannot be empty",
            }),
        }),
    },

    // DELETE /api/v1/employees/:id - Delete an Employee
    delete: {
        params: Joi.object({
            id: Joi.string().required().messages({
                "any.required": "Employee ID is required",
                "string.empty": "Employee ID cannot be empty",
            }),
        }),
    },

}