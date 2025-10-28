import Joi from "joi";
import { RequestSchema } from "../middleware/validate";

/**
 * @openapi
 * components:
 *   schemas:
 *     Employee:
 *       type: object
 *       required:
 *         - id
 *         - name
 *         - position
 *         - department
 *         - email
 *         - phone
 *         - branchId
 *       properties:
 *         id:
 *           type: string
 *           description: The Firestore document ID for the employee
 *           example: "fe4ghb67dg2d1ac1"
 *         name:
 *           type: string
 *           description: Full name of the employee
 *           example: "Alice Johnson"
 *         position:
 *           type: string
 *           description: Job title or position
 *           example: "Branch Manager"
 *         department:
 *           type: string
 *           description: Department the employee belongs to
 *           example: "Management"
 *         email:
 *           type: string
 *           format: email
 *           description: Employee email address
 *           example: "alice.johnson@example.com"
 *         phone:
 *           type: string
 *           description: Contact phone number
 *           example: "604-555-0148"
 *         branchId:
 *           type: integer
 *           description: Numeric identifier of the branch the employee belongs to
 *           example: 1
 */

/**
 * Employee schema organized by request type
 */
export const employeeSchemas: Record<string, RequestSchema> = {
    // POST /api/v1/employees - Create new Employee
    create: {
        body: Joi.object({
            name: Joi.string().required().messages({
                "any.required": "Employee name is required",
                "string.empty": "Employee name cannot be empty",
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