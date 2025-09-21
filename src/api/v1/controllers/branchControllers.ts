import { Request, Response, NextFunction } from "express";
import * as branchServices from "../services/branchServices";
import { Branch } from "../models/models";

/**
 * Manages requests and responses to retrieve all branches.
 * @param req - The express Request
 * @param res - The express Response
 * @param next - The express middleware chaining function
 */
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

/**
 * Manages requests and responses to retrieve a branch item.
 * @param req - The express Request
 * @param res - The express Response
 * @param next - The express middleware chaining function
 */
export const getBranchByID = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const id: number = parseInt(req.params.id); 
        const branch: Branch = await branchServices.getBranchByID(id);
         res.status(200).json({
            message: "Branch retrieved",
            data: branch,
        });
    } catch (error: unknown) {
        next(error);
    }
};

/**
 * Manages requests and responses to create a branch.
 * @param req - The express Request
 * @param res - The express Response
 * @param next - The express middleware chaining function
 */
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
                    message: "Branch created successfully",
                    data: newBranch,
                });
            }
    } catch (error: unknown) {
        next(error);
    }
};

/**
 * Manages requests and responses to update a branch
 * @param req - The express Request
 * @param res - The express Response
 * @param next - The express middleware chaining function
 */
export const updateBranch = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const id: number = parseInt(req.params.id);
        // Extracting the fields to be updated from the body
        const { address, phone } = req.body;
        // Create the update branch object with fields to be updated
        const updatedBranch: Branch = await branchServices.updateBranch(id, { address, phone });
        res.status(200).json({
            message: "Branch updated successfully",
            data: updatedBranch,
        });
    } catch (error: unknown) {
    next(error);
    }
};

/**
 * Manages requests and responses to delete a branch.
 * @param req - The express Request
 * @param res - The express Response
 * @param next - The express middleware chaining function
 */
export const deleteBranch = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const id: number = parseInt(req.params.id);

        await branchServices.deleteBranch(id);
        res.status(200).json({
            message: "Branch deleted successfully",
        });
    } catch (error: unknown) {
        next(error);
    }
};