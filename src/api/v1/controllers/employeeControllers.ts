import { Request, Response, NextFunction } from "express";
import * as employeeServices from "../services/employeeServices";
import { Employee } from "../models/models";
import { successResponse } from "../models/responseModels";

/**
 * Manages requests and responses to retrieve all employees.
 * @param req - The express Request
 * @param res - The express Response
 * @param next - The express middleware chaining function
 */
export const getAllEmployees = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        // await pauses the execution of the async functions in the employeeServices
        // until the Promise is resolved, so we get the actual employees array before sending the response
        const employees: Employee[] = await employeeServices.getAllEmployees();
        res.status(200).json( 
            successResponse(employees, "Employees retrieved successfully")
        );
    } catch (error: unknown) {
        next(error);
    }
};

/**
 * Manages requests and responses to retrieve an employee item.
 * @param req - The express Request
 * @param res - The express Response
 * @param next - The express middleware chaining function
 */
export const getEmployeeByID = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        // req.params are always strings by default so we need to convert the id to number
        const id: number = parseInt(req.params.id); 
        const employee: Employee = await employeeServices.getEmployeeByID(id);
        res.status(200).json(
            successResponse(employee, "Get an employee")
        );
    } catch (error: unknown) {
        next(error);
    }
};

/**
 * Manages requests and responses to create an employee.
 * @param req - The express Request
 * @param res - The express Response
 * @param next - The express middleware chaining function
 */
export const createEmployee = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { name, position, department, email, phone, branchId } = req.body;
        const newEmployee: Employee = await employeeServices.createEmployee({
            name, position, department, email, phone, branchId
        });
        res.status(201).json(
            successResponse(newEmployee, "Employee created successfully")
        );
    } catch (error: unknown) {
        next(error);
    };
};

/**
 * Manages requests and responses to update an employee.
 * @param req - The express Request
 * @param res - The express Response
 * @param next - The express middleware chaining function
 */
export const updateEmployee = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const id: number = parseInt(req.params.id);
        // Extracting the fields to be updated from the body
        const { position, phone } = req.body;
        // Create the update employee object with fields to be updated
        const updatedEmployee: Employee = await employeeServices.updateEmployee(id, { 
            position,
            phone,
        });
        
        res.status(200).json(
            successResponse(updatedEmployee, "Employee updated successfully")
        );
    } catch (error: unknown) {
    next(error);
    }
};

/**
 * Manages requests and responses to delete an employee.
 * @param req - The express Request
 * @param res - The express Response
 * @param next - The express middleware chaining function
 */
export const deleteEmployee = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const id: number = parseInt(req.params.id);

        await employeeServices.deleteEmployee(id);
        res.status(200).json(
            successResponse("Employee deleted successfully")
        );
    } catch (error: unknown) {
        next(error);
    }
};

/**
 * Manages requests and responses to retrieve all employees in specified branch ID
 * @param req - The express Request
 * @param res - The express Response
 * @param next - The express middleware chaining function
 */
export const getAllBranchEmployees = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const branchId: number = parseInt(req.params.branchId);
        const branchEmployees: Employee[] = await employeeServices.getAllBranchEmployees(branchId);
        res.status(200).json(
            successResponse(branchEmployees, "Employees in specified branch retrieved")
        ); 
    } catch (error: unknown) {
        next(error);
    }
};

/**
 * Manages requests and responses to retrieve all employees in specified department
 * @param req - The express Request
 * @param res - The express Response
 * @param next - The express middleware chaining function
 */
export const getDepartmentEmployees = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const department: string = req.params.department;
        const departmentEmployees: Employee[] = await employeeServices.getDepartmentEmployees(department);
        res.status(200).json(
            successResponse(departmentEmployees, "Employees in specified department retrieved")
        ); 
    } catch (error: unknown) {
        next(error);
    }
};