import { Request, Response, NextFunction } from "express";
import { validateRequest } from "../src/api/v1/middleware/validate";
import { employeeSchemas } from "../src/api/v1/validations/employeeValidations";
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

    // Test to verify it correctly validates data for creating new employee
    it("should pass validation for valid employee data", () => {
        // Arrange
        mockReq.body = {
            name: "Valid Name",         
            position: "Valid Position",
            department: "Valid Department",
            email: "valid_email@test.com",
            phone: "000-000-0000",
            branchId: 1
        };
        const middleware: MiddlewareFunction = validateRequest(
            employeeSchemas.create
        );

        // Act
        middleware(mockReq as Request, mockRes as Response, mockNext);

        // Assert
        expect(mockNext).toHaveBeenCalled();
        expect(mockRes.status).not.toHaveBeenCalled();
    });

    // Test to verify it rejects missing input when creating new employee
    it("should fail validation when employee name is empty", () => {
        // Arrange
        mockReq.body = {
            name: "",
            position: "Valid Position",
            department: "Valid Department",
            email: "valid_email@test.com",
            phone: "000-000-0000",
            branchId: 1
        };
        const middleware: MiddlewareFunction = validateRequest(
            employeeSchemas.create
        );

        // Act
        middleware(mockReq as Request, mockRes as Response, mockNext);

        // Assert
        expect(mockNext).not.toHaveBeenCalled();
        expect(mockRes.status).toHaveBeenCalledWith(400);
        expect(mockRes.json).toHaveBeenCalledWith({
            error: "Validation error: Body: Employee name cannot be empty",
        });
    });

    // Test to verify it correctly validates data for updating an employee
    it("should pass for valid body input for updating an employee", () => {
        // Arrange
        mockReq.params = { id: "1" };
        mockReq.body = { postion: "Update Position", phone: "000-000-0000" };
        const middleware = validateRequest(employeeSchemas.update);

        // Act
        middleware(mockReq as Request, mockRes as Response, mockNext);

        // Assert
        expect(mockNext).toHaveBeenCalled();
        expect(mockRes.status).not.toHaveBeenCalled();
        expect(mockRes.json).not.toHaveBeenCalled();
    });

    // Test to verify it rejects when body is missing for updating an employee
    it("should fail for missing body input for updating an employee", () => {
        // Arrange
        // Position is an empty string
        mockReq.params = { id: "1" };
        mockReq.body = { position: "", phone: "000-000-0000" };
        const middleware = validateRequest(employeeSchemas.update);

        // Act
        middleware(mockReq as Request, mockRes as Response, mockNext);

        // Assert
        expect(mockRes.status).toHaveBeenCalledWith(400);
        expect(mockRes.json).toHaveBeenCalledWith({
            error: expect.stringContaining("Position cannot be empty"),
        });
        expect(mockNext).not.toHaveBeenCalled();
    });

    // Test to verify it correctly validates required params for deleting an employee
    it("should validate ID parameter correctly", () => {
        // Arrange
        mockReq.params = { id: "1" };
        const middleware: MiddlewareFunction = validateRequest(
            employeeSchemas.delete
        );

        // Act
        middleware(mockReq as Request, mockRes as Response, mockNext);

        // Assert
        expect(mockNext).toHaveBeenCalled();
    });

    // Test to verify it rejects when Employee ID is missing
    it("should fail when required ID parameter is missing", () => {
        // Arrange
        // Missing required id
        mockReq.params = {};
        const middleware: MiddlewareFunction = validateRequest(
            employeeSchemas.delete
        );

        // Act
        middleware(mockReq as Request, mockRes as Response, mockNext);

        // Assert
        expect(mockRes.status).toHaveBeenCalledWith(400);
        expect(mockRes.json).toHaveBeenCalledWith({
            error: expect.stringContaining('Params: Employee ID is required'),
        });
    });
});
