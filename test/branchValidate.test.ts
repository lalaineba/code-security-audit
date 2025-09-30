import { Request, Response, NextFunction } from "express";
import { validateRequest } from "../src/api/v1/middleware/validate";
import { branchSchemas } from "../src/api/v1/validations/branchesValidations";
import { MiddlewareFunction } from "../src/api/v1/types/express";

describe("Validation Middleware", () => {
    let mockReq: Partial<Request>;
    let mockRes: Partial<Response>;
    let mockNext: NextFunction;

    beforeEach(() => {
        mockReq = {
            body: {},
            params: {},
            query: {},
        };
        mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        mockNext = jest.fn();
    });

    // Test to verify it correctly validates data for creating new branch
    it("should pass validation for valid branch data", () => {
        // Arrange
        mockReq.body = {
            name: "Valid Name",         
            address: "Valid Address",
            phone: "000-000-0000"
        };
        const middleware: MiddlewareFunction = validateRequest(
            branchSchemas.create
        );

        // Act
        middleware(mockReq as Request, mockRes as Response, mockNext);

        // Assert
        expect(mockNext).toHaveBeenCalled();
        expect(mockRes.status).not.toHaveBeenCalled();
    });

    // Test to verify it rejects missing input when creating new branch
    it("should fail validation when branch name is empty", () => {
        // Arrange
        mockReq.body = {
            name: "",
            address: "Valid Address",
            phone: "000-000-0000"
        };
        const middleware: MiddlewareFunction = validateRequest(
            branchSchemas.create
        );

        // Act
        middleware(mockReq as Request, mockRes as Response, mockNext);

        // Assert
        expect(mockNext).not.toHaveBeenCalled();
        expect(mockRes.status).toHaveBeenCalledWith(400);
        expect(mockRes.json).toHaveBeenCalledWith({
            error: "Validation error: Body: Branch name cannot be empty",
        });
    });

    // Test to verify it correctly validates data for updating a branch
    it("should pass for valid body input for updating a branch", () => {
        // Arrange
        mockReq.params = { id: "1" };
        mockReq.body = { address: "Update Address", phone: "111-000-0000" };
        const middleware = validateRequest(branchSchemas.update);

        // Act
        middleware(mockReq as Request, mockRes as Response, mockNext);

        // Assert
        expect(mockNext).toHaveBeenCalled();
        expect(mockRes.status).not.toHaveBeenCalled();
        expect(mockRes.json).not.toHaveBeenCalled();
    });

    // Test to verify it rejects when body is missing for updating a branch
    it("should fail for missing body input for updating a branch", () => {
        // Arrange
        // Address is an empty string
        mockReq.params = { id: "1" };
        mockReq.body = { address: "", phone: "000-000-0000" };
        const middleware = validateRequest(branchSchemas.update);

        // Act
        middleware(mockReq as Request, mockRes as Response, mockNext);

        // Assert
        expect(mockRes.status).toHaveBeenCalledWith(400);
        expect(mockRes.json).toHaveBeenCalledWith({
            error: expect.stringContaining("Address cannot be empty"),
        });
        expect(mockNext).not.toHaveBeenCalled();
    });

    // Test to verify it correctly validates required params for deleting an branch
    it("should validate ID parameter correctly", () => {
        // Arrange
        mockReq.params = { id: "1" };
        const middleware: MiddlewareFunction = validateRequest(
            branchSchemas.delete
        );

        // Act
        middleware(mockReq as Request, mockRes as Response, mockNext);

        // Assert
        expect(mockNext).toHaveBeenCalled();
    });

    // Test to verify it rejects when branch ID is missing
    it("should fail when required ID parameter is missing", () => {
        // Arrange
        // Missing required id
        mockReq.params = {};
        const middleware: MiddlewareFunction = validateRequest(
            branchSchemas.delete
        );

        // Act
        middleware(mockReq as Request, mockRes as Response, mockNext);

        // Assert
        expect(mockRes.status).toHaveBeenCalledWith(400);
        expect(mockRes.json).toHaveBeenCalledWith({
            error: expect.stringContaining('Params: Branch ID is required'),
        });
    });
});
