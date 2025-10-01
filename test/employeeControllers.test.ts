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
                    id: "1",
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
                status: "Success!",
                data: mockEmployees,
            });
        });
    });

    // Test successful employee retrieval by employee ID
    describe("getEmployeeByID", () => {
        it("should handle successful employee retrieval", async () => {
            // Arrange
            mockReq.params = { id: "1" };

            // Defining an instance of what it should return
            const mockEmployee: Employee = {
                id: "1",
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
                status: "Success!",
                data: mockEmployee,
            });
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

            const mockEmployee: Partial<Employee> = { id: "1", ...mockBody };

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
                status: "Success!",
                data: mockEmployee,
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
                id: "1",
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
            expect(employeeServices.updateEmployee).toHaveBeenCalledWith("1", {
                position: mockBody.position,
                phone: mockBody.phone,
            });
            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: "Employee updated successfully",
                status: "Success!",
                data: mockUpdate,
            });
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
            expect(employeeServices.deleteEmployee).toHaveBeenCalledWith("1");
            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith({
                data: null,
                message: "Employee deleted successfully",
                status: "Success!",   
            });
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
                    id: "1",
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
                status: "Success!",
            });
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
                    id: "1",
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
                status: "Success!",
            });
        });
    });
});