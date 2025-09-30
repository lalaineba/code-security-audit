import { Request, Response, NextFunction } from "express";
import { Branch } from "../src/api/v1/models/models";
import * as branchControllers from "../src/api/v1/controllers/branchControllers";
import * as branchServices from "../src/api/v1/services/branchServices";

jest.mock("../src/api/v1/services/branchServices");

describe("Branch Controller", () => {
    // Making every parameter optional
    let mockReq: Partial<Request>;
    let mockRes: Partial<Response>;
    let mockNext: NextFunction;

    // setting up an empty structure for mocks
    beforeEach(() => {
        jest.clearAllMocks();
        mockReq = { params: {}, body: {} };
        mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        mockNext = jest.fn();
    });

    // Test to verify that all branch records are returned as an array
    describe("getAllBranches", () => {
        it("should handle successful getAllBranches operation", async () => {
            // Arrange
            // Defining an instance of what it should return
            const mockBranches: Branch[] = [
                {
                    id: 1,
                    name: "Test Branch",
                    address: "Test Address",
                    phone: "000-000-0000"
                },
            ];
            (branchServices.getAllBranches as jest.Mock).mockReturnValue(mockBranches);

            // Act 
            await branchControllers.getAllBranches(
                mockReq as Request,
                mockRes as Response,
                mockNext
            );

            // Assert
            // If the controller runs correctly, it should set the status to 200
            expect(mockRes.status).toHaveBeenCalledWith(200);
            // To check if the controller is setting the JSON values correctly
            expect(mockRes.json).toHaveBeenCalledWith({
                message: "Branches retrieved successfully",
                data: mockBranches,
            });
        });

        // Test when the service fails, the controller handles the error properly
        it("should handle getAllBranches errors", async () => {
            // Arrange
            const mockError: Error = new Error('Test error');
            (branchServices.getAllBranches as jest.Mock).mockRejectedValue(mockError);

            // Act
            await branchControllers.getAllBranches(
                mockReq as Request, 
                mockRes as Response, 
                mockNext);

            // Assert
            expect(mockNext).toHaveBeenCalledWith(mockError);
        });
    });

    // Test successful branch retrieval by branch ID
    describe("getBranchByID", () => {
        it("should handle successful branch retrieval", async () => {
            // Arrange
            mockReq.params = { id: "1" };

            // Defining an instance of what it should return
            const mockBranch: Branch = {
                id: 1,
                name: "Test Name",
                address:"Test Address",
                phone: "000-000-0000"
            };
            (branchServices.getBranchByID as jest.Mock).mockReturnValue(mockBranch);

            // Act 
            await branchControllers.getBranchByID(
                mockReq as Request,
                mockRes as Response,
                mockNext
            );

            // Assert
            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: "Branch retrieved",
                data: mockBranch,
            });
        });

        // Test with an invalid branch ID
        it("should handle error when branch ID is invalid", async () => {
            // Arrange
            mockReq.params = { id: "100" };
            mockReq.body = { name: "Test Name" };

            const mockError: Error = new Error("Branch ID: 100 not found.");
            (branchServices.getBranchByID as jest.Mock).mockRejectedValue(mockError);

            // Act
            await branchControllers.getBranchByID(
                mockReq as Request,
                mockRes as Response,
                mockNext
            );

            // Assert
            expect(mockNext).toHaveBeenCalledWith(mockError);
            });
        });
        
    // Test successful branch creation
    describe("createBranch", () => {
        it("should handle successful branch creation", async () => {
            // Arrange
            const mockBody: object = {
                name: "Test Name",
                address: "Test Address",
                phone: "000-000-0000",
            };

            const mockBranch: Partial<Branch> = { id: 1, ...mockBody };

            mockReq.body = mockBody;
            (branchServices.createBranch as jest.Mock).mockReturnValue(mockBranch);

            // Act
            await branchControllers.createBranch(
                mockReq as Request,
                mockRes as Response,
                mockNext
            );

            // Assert
            expect(mockRes.status).toHaveBeenCalledWith(201);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: "Branch created successfully",
                data: mockBranch,
            });
        });

        // Test with a missing parameter
        it("should return 400 when branch name is missing", async () => {
            // Arrange
            mockReq.body = { address: "Test Address" };

            // Act
            await branchControllers.createBranch(
                mockReq as Request,
                mockRes as Response,
                mockNext
            );

            // Assert
            expect(mockRes.status).toHaveBeenCalledWith(400);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: "Branch name is required",
            });
        });
    });

    // Test successful branch update
    describe("updateBranch", () => {
        it("should handle successful branch update", async () => {
            // Arrange
            mockReq.params = { id: "1" };
            const mockBody: Partial<Branch> = {
                address: "Updated Address",
                phone: "111-111-1111"
            };
            mockReq.body = mockBody;

            const mockUpdate: Partial<Branch> = { 
                id: 1,
                address: mockBody.address, 
                phone: mockBody.phone,
            };

            (branchServices.updateBranch as jest.Mock).mockResolvedValue(mockUpdate);

            // Act
            await branchControllers.updateBranch(
                mockReq as Request,
                mockRes as Response,
                mockNext
            );

            // Assert
            expect(branchServices.updateBranch).toHaveBeenCalledWith(1, {
                address: mockBody.address,
                phone: mockBody.phone,
            });
            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: "Branch updated successfully",
                data: mockUpdate,
            });
        });

        // Test with a missing required parameter
        it("should handle errors if branch ID is invalid", async () => {
            // Arrange
            mockReq.params = { id: "100" };
            mockReq.body = { address: "Address", phone: "000-000-0000" };

            const mockError: Error = new Error("Branch ID: 100 not found.");
            (branchServices.updateBranch as jest.Mock).mockRejectedValue(mockError);

            // Act
            await branchControllers.updateBranch(
                mockReq as Request,
                mockRes as Response,
                mockNext
            );

            // Assert
            expect(mockNext).toHaveBeenCalledWith(mockError);
            });
        });

    // Test successful branch deletion
    describe("deleteBranch", () => {
        it("should handle successful branch deletion", async () => {
            // Arrange
            mockReq.params = { id: "1" };
            // undefined because there is nothing to return
            (branchServices.deleteBranch as jest.Mock).mockResolvedValue(undefined);

            // Act
            await branchControllers.deleteBranch(
                mockReq as Request,
                mockRes as Response,
                mockNext
            );

            // Assert
            expect(branchServices.deleteBranch).toHaveBeenCalledWith(1);
            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: "Branch deleted successfully"
            });
        });

        // Test with an invalid branch ID
        it("should handle errors if branch ID is invalid", async () => {
            // Arrange
            mockReq.params = { id: "100" };
            const mockError: Error = new Error("Branch ID: 100 not found.");
            (branchServices.deleteBranch as jest.Mock).mockRejectedValue(mockError);

            // Act
            await branchControllers.deleteBranch(
                mockReq as Request,
                mockRes as Response,
                mockNext
            );

            // Assert
            expect(branchServices.deleteBranch).toHaveBeenCalledWith(100);
            expect(mockNext).toHaveBeenCalledWith(mockError);
        });
    });
});