import { Request, Response, NextFunction } from "express";
import { Employee } from "../src/api/v1/models/models";
import * as employeeControllers from "../src/api/v1/controllers/employeeControllers";
import * as employeeServices from "../src/api/v1/services/employeeServices";

jest.mock("../src/api/v1/services/employeeServices");

describe("Employee Controller", () => {
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

    // Test to verify that all employee records are returned as an array
    describe("getAllEmployees", () => {
        it("should handle successful getAllEmployees operation", async () => {
            // Arrange
            // Defining an instance of what it should return
            const mockEmployees: Employee[] = [
                {
                    id: 1,
                    name: "Test Name",
                    position: "Test Position",
                    department: "Test Department",
                    email: "test@email.com",
                    phone: "000-000-0000",
                    branchId: 1
                },
            ];
            (employeeServices.getAllEmployees as jest.Mock).mockReturnValue(mockEmployees);

            // Act 
            await employeeControllers.getAllEmployees(
                mockReq as Request,
                mockRes as Response,
                mockNext
            );

            // Assert
            // If the controller runs correctly, it should set the status to 200
            expect(mockRes.status).toHaveBeenCalledWith(200);
            // To check if the controller is setting the JSON values correctly
            expect(mockRes.json).toHaveBeenCalledWith({
                message: "Employees retrieved successfully",
                data: mockEmployees,
            });
        });

        // Test when the service fails, the controller handles the error properly
        it("should handle getAllEmployees errors", async () => {
            // Arrange
            // To simulate an error in the service
            const mockError: Error = new Error('Test error');
            (employeeServices.getAllEmployees as jest.Mock).mockRejectedValue(mockError);

            // Act
            await employeeControllers.getAllEmployees(
                mockReq as Request, 
                mockRes as Response, 
                mockNext);

            // Assert
            expect(mockNext).toHaveBeenCalledWith(mockError);
        });
    });

    // Test successful employee retrieval by employee ID
    describe("getEmployeeByID", () => {
        it("should handle successful employee retrieval", async () => {
            // Arrange
            mockReq.params = { id: "1" };

            // Defining an instance of what it should return
            const mockEmployee: Employee = {
                id: 1,
                name: "Test Name",
                position: "Test Position",
                department: "Test Department",
                email: "test@email.com",
                phone: "000-000-0000",
                branchId: 1
            };
            (employeeServices.getEmployeeByID as jest.Mock).mockReturnValue(mockEmployee);

            // Act 
            await employeeControllers.getEmployeeByID(
                mockReq as Request,
                mockRes as Response,
                mockNext
            );

            // Assert
            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: "Get an employee",
                data: mockEmployee,
            });
        });

        // Test with an invalid employee ID
        it("should handle error when employee ID is invalid", async () => {
            // Arrange
            mockReq.params = { id: "100" };
            mockReq.body = { name: "Test Name" };

            const mockError: Error = new Error("Employee ID: 100 not found.");
            (employeeServices.getEmployeeByID as jest.Mock).mockRejectedValue(mockError);

            // Act
            await employeeControllers.getEmployeeByID(
                mockReq as Request,
                mockRes as Response,
                mockNext
            );

            // Assert
            expect(mockNext).toHaveBeenCalledWith(mockError);
            });
        });

    // Test successful employee creation
    describe("createEmployee", () => {
        it("should handle successful employee creation", async () => {
            // Arrange
            const mockBody: object = {
                name: "Test Name",
                position: "Test Position",
                department: "Test Department",
                email: "test@email.com",
                phone: "000-000-0000",
                branchId: 1
            };

            const mockEmployee: Partial<Employee> = { id: 1, ...mockBody };

            mockReq.body = mockBody;
            (employeeServices.createEmployee as jest.Mock).mockReturnValue(mockEmployee);

            // Act
            await employeeControllers.createEmployee(
                mockReq as Request,
                mockRes as Response,
                mockNext
            );

            // Assert
            expect(mockRes.status).toHaveBeenCalledWith(201);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: "Employee created successfully",
                data: mockEmployee,
            });
        });

        // Test with a missing parameter
        it("should return 400 when employee name is missing", async () => {
            // Arrange
            mockReq.body = { position: "Test Position" };

            // Act
            await employeeControllers.createEmployee(
                mockReq as Request,
                mockRes as Response,
                mockNext
            );

            // Assert
            expect(mockRes.status).toHaveBeenCalledWith(400);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: "Employee name is required",
            });
        });
    });

    // Test successful employee update
    describe("updateEmployee", () => {
        it("should handle successful employee update", async () => {
            // Arrange
            mockReq.params = { id: "1" };
            const mockBody: Partial<Employee> = {
                position: "Updated Position",
                phone: "111-111-1111"
            };
            mockReq.body = mockBody;

            const mockUpdate: Partial<Employee> = { 
                id: 1,
                position: mockBody.position, 
                phone: mockBody.phone,
            };

            (employeeServices.updateEmployee as jest.Mock).mockResolvedValue(mockUpdate);

            // Act
            await employeeControllers.updateEmployee(
                mockReq as Request,
                mockRes as Response,
                mockNext
            );

            // Assert
            expect(employeeServices.updateEmployee).toHaveBeenCalledWith(1, {
                position: mockBody.position,
                phone: mockBody.phone,
            });
            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: "Employee updated successfully",
                data: mockUpdate,
            });
        });

        // Test with a missing required parameter
        it("should handle errors if employee ID is invalid", async () => {
            // Arrange
            mockReq.params = { id: "100" };
            mockReq.body = { position: "Position", phone: "000-000-0000" };

            const mockError: Error = new Error("Employee ID: 100 not found.");
            (employeeServices.updateEmployee as jest.Mock).mockRejectedValue(mockError);

            // Act
            await employeeControllers.updateEmployee(
                mockReq as Request,
                mockRes as Response,
                mockNext
            );

            // Assert
            expect(mockNext).toHaveBeenCalledWith(mockError);
            });
        });

    // Test successful employee deletion
    describe("deleteEmployee", () => {
        it("should handle successful employee deletion", async () => {
            // Arrange
            mockReq.params = { id: "1" };
            // undefined because there is nothing to return
            (employeeServices.deleteEmployee as jest.Mock).mockResolvedValue(undefined);

            // Act
            await employeeControllers.deleteEmployee(
                mockReq as Request,
                mockRes as Response,
                mockNext
            );

            // Assert
            expect(employeeServices.deleteEmployee).toHaveBeenCalledWith(1);
            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: "Employee deleted successfully"
            });
        });

        // Test with an invalid employee ID
        it("should handle errors if employee ID is invalid", async () => {
            // Arrange
            mockReq.params = { id: "100" };
            const mockError: Error = new Error("Employee ID: 100 not found.");
            (employeeServices.deleteEmployee as jest.Mock).mockRejectedValue(mockError);

            // Act
            await employeeControllers.deleteEmployee(
                mockReq as Request,
                mockRes as Response,
                mockNext
            );

            // Assert
            expect(employeeServices.deleteEmployee).toHaveBeenCalledWith(100);
            expect(mockNext).toHaveBeenCalledWith(mockError);
        });
    });

    // Test successful employees by branch retrieval by branch ID
    describe("getAllBranchEmployees", () => {
        it("should handle successful getAllBranchEmployees operation", async () => {
            // Arrange
            mockReq.params = { branchId: "1" };

            // Defining an instance of what it should return
            const mockEmployee: Employee[] = [
                {
                    id: 1,
                    name: "Test Name",
                    position: "Test Position",
                    department: "Test Department",
                    email: "test@email.com",
                    phone: "000-000-0000",
                    branchId: 1
                },
            ];
            (employeeServices.getAllBranchEmployees as jest.Mock).mockReturnValue(mockEmployee);

            // Act 
            await employeeControllers.getAllBranchEmployees(
                mockReq as Request,
                mockRes as Response,
                mockNext
            );

            // Assert
            expect(employeeServices.getAllBranchEmployees).toHaveBeenCalledWith(1);
            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: "Employees in specified branch retrieved",
                data: mockEmployee,
            });
        });

        // Test with an invalid branch ID
        it("should handle error when branch ID is invalid", async () => {
            // Arrange
            mockReq.params = { branchId: "100" };
            mockReq.body = { name: "Test Name" };
            const mockError: Error = new Error("Branch ID: 100 not found.");
            (employeeServices.getAllBranchEmployees as jest.Mock).mockRejectedValue(mockError);

            // Act
            await employeeControllers.getAllBranchEmployees(
                mockReq as Request,
                mockRes as Response,
                mockNext
            );

            // Assert
            expect(employeeServices.getAllBranchEmployees).toHaveBeenCalledWith(100);
            expect(mockNext).toHaveBeenCalledWith(mockError);
        });
    });
        
        // Test successful employees by department retrieval
    describe("getDepartmentEmployees", () => {
        it("should handle successful getDepartmentEmployees operation", async () => {
            // Arrange
            mockReq.params = { department: "Test Department" };

            // Defining an instance of what it should return
            const mockEmployee: Employee[] = [
                {
                    id: 1,
                    name: "Test Name",
                    position: "Test Position",
                    department: "Test Department",
                    email: "test@email.com",
                    phone: "000-000-0000",
                    branchId: 1
                }, 
            ];
            (employeeServices.getDepartmentEmployees as jest.Mock).mockResolvedValue(mockEmployee);

            // Act 
            await employeeControllers.getDepartmentEmployees(
                mockReq as Request,
                mockRes as Response,
                mockNext
            );

            // Assert
            expect(employeeServices.getDepartmentEmployees).toHaveBeenCalledWith("Test Department");
            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: "Employees in specified department retrieved",
                data: mockEmployee,
            });
        });

        // Test with a missing department paremeter
        it("should handle error when department parameter is invalid", async () => {
            // Arrange
            mockReq.params = { department: "Invalid Department" };
            const mockError: Error = new Error("Department name: Invalid Department not found.");
            (employeeServices.getDepartmentEmployees as jest.Mock).mockRejectedValue(mockError);

            // Act
            await employeeControllers.getDepartmentEmployees(
                mockReq as Request,
                mockRes as Response,
                mockNext
            );

            // Assert
            expect(employeeServices.getDepartmentEmployees).toHaveBeenCalledWith("Invalid Department");
            expect(mockNext).toHaveBeenCalledWith(mockError);
        });
    });
});