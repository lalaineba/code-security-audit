import { Request, Response, NextFunction } from "express";
import * as branchServices from "../services/branchServices";
import { Branch } from "../models/models";
import { successResponse } from "../models/responseModels";

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
        res.status(200).json(
            successResponse(branch, "Branches retrieved successfully")
        );
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
        const id: string = req.params.id; 
        const branch: Branch = await branchServices.getBranchByID(id);
        res.status(200).json(
            successResponse(branch,"Branch retrieved")
        );
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
        const { name, address, phone } = req.body;
        const newBranch: Branch = await branchServices.createBranch({
            name, address, phone
        });
        res.status(201).json(
            successResponse(newBranch, "Branch created successfully")
        );
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
        const id: string = req.params.id;
        // Extracting the fields to be updated from the body
        const { address, phone } = req.body;
        // Create the update branch object with fields to be updated
        const updatedBranch: Branch = await branchServices.updateBranch(id, { 
            address,
            phone
        });

        res.status(200).json(
            successResponse(updatedBranch, "Branch updated successfully")
        );
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
        const id: string = req.params.id;

        await branchServices.deleteBranch(id);
        res.status(200).json(
            successResponse("Branch deleted successfully")
        );
    } catch (error: unknown) {
        next(error);
    }
};