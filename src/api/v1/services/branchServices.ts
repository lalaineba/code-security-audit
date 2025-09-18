import { Employee } from "src/data/employees";
import { branches } from "../../../data/branches";
import { Branch } from "../models/models";

/**
 * Retrieves all branches from storage
 * @returns Array of all branches
 */
export const getAllBranches = async(): Promise<Branch[]> => {
    return structuredClone(branches);
};

/**
 * Retrieves a branch by its ID
 * @param id The ID of the branch
 * @returns A branch item with its data 
 * @throws An error if branch ID is not found
 */
export const getBranchByID = async (id: number): Promise<Branch> => {
    let allBranches = await getAllBranches();
    const branch: Branch | undefined = allBranches.find((branch: Branch) => branch.id === id);

    if (!branch) {
        throw new Error(`Branch ID: ${id} not found.`);
    };

    return structuredClone(branch);
};

/**
 * Creates a new branch item
 * @param branchControllers The data for the new branch
 * @returns The created branch with generated branch ID
 */
export const createBranch = async (branchData: {
    name: string;
    address: string;
    phone: string;
}): Promise<Branch> => {
    // Creating a new branch data with unique generated ID
    const newBranch: Branch = {
        id: Number((branches.length) + 1),
        name: branchData.name,
        address: branchData.address,
        phone: branchData.phone,
    };

    // Adds the new branch to the end of the branch array
    branches.push(newBranch);
    
    return structuredClone(newBranch);
};

/**
 * Updates an existing branch
 * @param id The ID of the branch to update
 * @param branchData The fields to update (address and/or phone)
 * @returns The new updated branch data
 * @throws An error if branch ID is not found
 */
export const updateBranch = async (
    id: number,
    // From this Branch object, we can only pick address and/or phone
    branchData: Pick<Branch, "address" | "phone">
): Promise<Branch> => {
    const branchIndex: number = branches.findIndex((branch: Branch) => branch.id === id);

    if (!branchIndex) {
            throw new Error(`Branch ID: ${id} not found.`);
        };
    
    branches[branchIndex] = { ...branches[branchIndex], ...branchData };
    
    return structuredClone(branches[branchIndex]);
};

/**
 * Deletes a branch from storage
 * @param id The ID of the branch to delete
 * @throws An error if branch ID is not found
 */
export const deleteBranch = async (id: number): Promise<void> => {
    const index: number = branches.findIndex((branch: Branch) => branch.id === id);

    if (index === -1) { 
        throw new Error(`Branch ID: ${id} not found.`);
    }

    branches.splice(index, 1);
};