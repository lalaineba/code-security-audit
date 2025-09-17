import { Request, Response, NextFunction } from "express";
import * as branchServices from "../services/branchServices";
import { branches } from "../../../data/branches";
import { Branch } from "../models/models";

export const getAllBranches = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const branch: Branch[] = await branchServices.getAllBranches();
        res.status(200).json({ 
            message: "Branches retrieved successfully", 
            data: branch,
        });
    } catch (error: unknown) {
        next(error);
    }
};

export const getBranchByID = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const id: number = parseInt(req.params.id); 
        const branch = await branchServices.getBranchByID(id);
         res.status(200).json({
            message: "Get an employee",
            data: branch,
        });
    } catch (error: unknown) {
        next(error);
    }
};

export const createBranch = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        if (!req.body.name) {
            res.status(400).json({
                message: "Branch name is required",
            });
        } else if (!req.body.address) {
            res.status(400).json({
                message: "Branch address is required",
            });
        } else if (!req.body.phone) {
            res.status(400).json({
                message: "Branch phone number is required",
            });
        } else {
            const { name, address, phone } = req.body;
            const newBranch: Branch = await branchServices.createBranch({
                    name, address, phone
                });
                res.status(201).json({
                    message: "Employee created successfully",
                    data: newBranch,
                });
            }
        } catch (error: unknown) {
            next(error);
        };
    };
