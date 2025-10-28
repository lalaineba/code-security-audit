import express, { Router } from "express";
import * as employeeControllers from "../controllers/employeeControllers";
import { validateRequest } from "../middleware/validate";
import { employeeSchemas } from "../validations/employeeValidations";


const router: Router = express.Router();

/**
 * @openapi
 * /employees:
 *   get:
 *     summary: Retrieve all employees
 *     tags: [Employees]
 *     responses:
 *       '200':
 *         description: Employees retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Employee'
 */
router.get("/", employeeControllers.getAllEmployees);

/**
 * @openapi
 * /employees/{id}:
 *   get:
 *     summary: Retrieve a single employee by ID
 *     tags: [Employees]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The Firestore document ID of the employee
 *     responses:
 *       '200':
 *         description: Get an employee
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Employee'
 *       '500':
 *         description: Employee ID not found.
 */
router.get("/:id", employeeControllers.getEmployeeByID);

/**
 * @openapi
 * /employees:
 *   post:
 *     summary: Create a new employee
 *     tags: [Employees]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               position:
 *                 type: string
 *               department:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               branchId:
 *                 type: integer
 *             required: [name, position, department, email, phone, branchId]
 *     responses:
 *       '201':
 *         description: Employee created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Employee'
 *       '400':
 *         description: Validation error
 */
router.post(
    "/",
    validateRequest(employeeSchemas.create),
    employeeControllers.createEmployee
);

/**
 * @openapi
 * /employees/{id}:
 *   put:
 *     summary: Update an existing employee
 *     tags: [Employees]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The Firestore document ID of the employee to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               position:
 *                 type: string
 *               phone:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Employee updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Employee'
 *       '400':
 *         description: Validation error
 *       '500':
 *         description: Employee ID not found.
 */
router.put(
    "/:id",
    validateRequest(employeeSchemas.update),
    employeeControllers.updateEmployee
);

/**
 * @openapi
 * /employees/{id}:
 *   delete:
 *     summary: Delete an employee by ID
 *     tags: [Employees]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The Firestore document ID of the employee to delete
 *     responses:
 *       '200':
 *         description: Employee deleted successfully
 *       '500':
 *         description: Employee ID not found.
 */
router.delete(
    "/:id",
    validateRequest(employeeSchemas.delete),
    employeeControllers.deleteEmployee);

/**
 * @openapi
 * /employees/branch/{branchId}:
 *   get:
 *     summary: Get employees for a specific branch
 *     tags: [Employees]
 *     parameters:
 *       - in: path
 *         name: branchId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Numeric branch identifier to filter employees
 *     responses:
 *       '200':
 *         description: Employees in specified branch retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Employee'
 *       '500':
 *         description: No employees found for branch ID.
 */
router.get("/branch/:branchId", employeeControllers.getAllBranchEmployees);

/**
 * @openapi
 * /employees/department/{department}:
 *   get:
 *     summary: Get employees for a specific department
 *     tags: [Employees]
 *     parameters:
 *       - in: path
 *         name: department
 *         required: true
 *         schema:
 *           type: string
 *         description: Department name to filter employees (case-insensitive)
 *     responses:
 *       '200':
 *         description: Employees in specified department retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Employee'
 *       '500':
 *         description: No employees found for Department.
 */
router.get("/department/:department", employeeControllers.getDepartmentEmployees);

export default router;