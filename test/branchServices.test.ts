import * as branchServices from "../src/api/v1/services/branchServices";
import * as firestoreRepository from "../src/api/v1/repositories/firestoreRepository";
import { Branch } from "../src/api/v1/models/models";

// Mock the repository module
jest.mock("../src/api/v1/repositories/firestoreRepository");

describe("Branch Service", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    // Test for getAllBranches service
    it("should successfully get all branches", async () => {
        // Arrange
        const mockBranchData: {
            id: string;
            name: string;
            address: string;
            phone: string;
        } = {
            id: "branch1",
            name: "Test Name",
            address: "Test Address",
            phone: "000-000-0000",
        }; 

        const mockQuerySnapshot: object = {
            docs: [
                {
                    id: mockBranchData.id,
                    // data() method returns the document's data (branch fields)
                    data: (): Partial<Branch> => ({
                        name: mockBranchData.name,
                        address: mockBranchData.address,
                        phone: mockBranchData.phone,
                    }),
                }
            ],
        };
        (firestoreRepository.getDocuments as jest.Mock).mockResolvedValue(
            mockQuerySnapshot
        );

        // Act
        const result: Branch[] = await branchServices.getAllBranches();

        // Assert
        expect(firestoreRepository.getDocuments).toHaveBeenCalledWith("branches");
        expect(result).toEqual([mockBranchData]);
    });

    // Test for createBranch service
    it("should successfully create a branch", async () => {
        // Arrange
        const mockBranchData: {
            name: string;
            address: string;
            phone: string;
        } = {
            name: "Test Name",
            address: "Test Address",
            phone: "000-000-0000",
        }; 
        const mockDocumentId: string = "test-branch-id";

        (firestoreRepository.createDocument as jest.Mock).mockResolvedValue(
            mockDocumentId
        );

        // Act
        const result: Branch = await branchServices.createBranch(mockBranchData);

        // Assert
        expect(firestoreRepository.createDocument).toHaveBeenCalledWith(
            "branches",
            expect.objectContaining({
                name: mockBranchData.name,
                address: mockBranchData.address,
                phone: mockBranchData.phone,
            })
        );
        expect(result.id).toBe(mockDocumentId);
        // Just to make sure that the returned branch object contains the correct name created
        expect(result.name).toBe(mockBranchData.name);
    });

    // Test for getBranchById service
    it("should successfully get a branch by id", async () => {
        // Arrange
        const mockBranchData: {
            id: string;
            name: string;
            address: string;
            phone: string;
        } = {
            id: "branch1",
            name: "Test Name",
            address: "Test Address",
            phone: "000-000-0000",
        }; 
        // Create a mock object that looks like what Firestore should return
        const mockDocumentSnapshot: object = {
            id: mockBranchData.id,
            // data() method returns the document's data (branch fields)
            data: (): Partial<Branch> => ({
                name: mockBranchData.name,
                address: mockBranchData.address,
                phone: mockBranchData.phone,
            }),
        };

        (firestoreRepository.getDocumentById as jest.Mock).mockResolvedValue(
            mockDocumentSnapshot
        );
        
        // Act
        const result: Branch = await branchServices.getBranchByID(
            mockBranchData.id
        );

        // Assert
        expect(firestoreRepository.getDocumentById).toHaveBeenCalledWith(
            "branches",
            mockBranchData.id
            );
        expect(result).toEqual(mockBranchData);
    });

    // Test for updateBranch service
    it("should successfully update a branch", async () => {
        // Arrange
        const mockDocumentId: string = "test-branch-id";
        const mockBranch: Branch = {
            id: "branch1",
            name: "Test Name",
            address: "Test Address",
            phone: "000-000-0000",
            };
        
        // Creates a mock for getBranchByID service's method
        jest.spyOn(branchServices, "getBranchByID").mockResolvedValue(mockBranch);

        (firestoreRepository.updateDocument as jest.Mock).mockResolvedValue(
            undefined
        );

        // Act
        await branchServices.updateBranch(mockDocumentId, mockBranch);

        // Assert
        expect(branchServices.getBranchByID).toHaveBeenCalledWith(mockDocumentId);
        expect(firestoreRepository.updateDocument).toHaveBeenCalledWith(
            "branches",
            mockDocumentId,
            expect.objectContaining({
                ...mockBranch,
            })
        );
    });

    // Test for deleteBranch service
    it("should successfully delete a branch by id", async () => {
    const mockDocumentId: string = "test-branch-id";
    const mockBranch: Branch = {
        id: mockDocumentId,
        name: "Test Name",
        address: "Test Address",
        phone: "000-000-0000",
        };
        
        // Creates a mock for getBranchByID service's method
        jest.spyOn(branchServices, "getBranchByID").mockResolvedValue(mockBranch);

        (firestoreRepository.deleteDocument as jest.Mock).mockResolvedValue(
            undefined
        );

        // Act
        await branchServices.deleteBranch(mockDocumentId);

        // Assert
        expect(branchServices.getBranchByID).toHaveBeenCalledWith(mockDocumentId);
        expect(firestoreRepository.deleteDocument).toHaveBeenCalledWith(
            "branches",
            mockDocumentId
        );
    });
});