import { Branch } from "../models/models";
import {
    QuerySnapshot,
    DocumentData,
    DocumentSnapshot,
} from "firebase-admin/firestore";
import {
    createDocument,
    getDocuments,
    getDocumentById,
    updateDocument,
    deleteDocument,
} from "../repositories/firestoreRepository";

// Reference to the firestore collection name
const COLLECTION: string = "branches";

/**
 * Retrieves all branches from storage
 * @returns Array of all branches
 * @throws An error if branches cannot be retrieved
 */
export const getAllBranches = async(): Promise<Branch[]> => {
    try {
        const snapshot: QuerySnapshot = await getDocuments(COLLECTION);
        const branches: Branch[] = snapshot.docs.map((doc) => {
            const data: DocumentData = doc.data();
            return {
                id: doc.id,
                ...data,
            } as Branch;
        });

        return branches;
    } catch (error: unknown) {
        throw error;
    }
};

/**
 * Retrieves a branch by its ID
 * @param id The ID of the branch
 * @returns A branch item with its data 
 * @throws An error if branch ID is not found
 */
export const getBranchByID = async (id: string): Promise<Branch> => {
    try {
        const doc: DocumentSnapshot | null = await getDocumentById(
            COLLECTION,
            id
        );

        if (!doc) {
            throw new Error(`Branch ID: ${id} not found.`);
        }

        const data: DocumentData | undefined = doc.data();
        const branch: Branch = {
            id: doc.id,
            ...data,
        } as Branch;

        return structuredClone(branch);
    } catch (error: unknown) {
        throw error;
    }
};

/**
 * Creates a new branch item
 * @param branchControllers The data for the new branch
 * @returns The created branch with generated branch ID
 * @throws An error if branch cannot be created
 */
export const createBranch = async (branchData: {
    name: string;
    address: string;
    phone: string;
}): Promise<Branch> => {
    try {
        const newBranch: Partial<Branch> = {
        ...branchData
    };

        const branchId: string = await createDocument(COLLECTION, newBranch);

        return structuredClone({ branchId, ...newBranch } as Branch);   
    } catch (error: unknown) {
        throw error;
    }
};

/**
 * Updates an existing branch
 * @param id The ID of the branch to update
 * @param branchData The fields to update (address and/or phone)
 * @returns The new updated branch data
 * @throws An error if branch ID is not found
 */
export const updateBranch = async (
    id: string,
    // From this Branch object, we can only pick address and/or phone
    branchData: Pick<Branch, "address" | "phone">
): Promise<Branch> => {
    try {
        const branch: Branch = await getBranchByID(id);
        if (!branch) {
            throw new Error(`Branch ID: ${id} not found.`);
        }

        const updateBranch: Branch = {
            ...branch,
        };

        if (branchData.address !== undefined)
            updateBranch.address = branchData.address;
        if (branchData.phone !== undefined)
            updateBranch.phone = branchData.phone;

        await updateDocument<Branch>(COLLECTION, id, updateBranch);

        return structuredClone(updateBranch);
    } catch (error: unknown) {
        throw error;
    }
};

/**
 * Deletes a branch from storage
 * @param id The ID of the branch to delete
 * @throws An error if branch ID is not found
 */
export const deleteBranch = async (id: string): Promise<void> => {
    try {
        const branch: Branch = await getBranchByID(id);
        if (!branch) { 
            throw new Error(`Branch ID: ${id} not found.`);
        }

        await deleteDocument(COLLECTION, id);
    } catch (error: unknown) {
        throw error;
    }
};