import { Request, Response, NextFunction } from "express";
import * as employeeServices from "../services/employeeServices";
import { Employee, employees } from "src/data/employees";

export const getAllEmployees = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const employees: Employee[] = await employeeServices.getAllEmployees();
        res.status(200).json({ 
            message: "Get all employees", 
            data: employees,
        });
    } catch (error: unknown) {
        next(error);
    }
};

export const getEmployeeByID = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const id: number = req.params.id; 
        await employeeServices.getEmployeeByID(id);
         res.status(200).json({
            message: "Get an employee",
            data: employees,
        });
    } catch (error: unknown) {
        next(error);
    }
};

export const createEmployee = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        if (!req.body.name) {
            res.status()
        }