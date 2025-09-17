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