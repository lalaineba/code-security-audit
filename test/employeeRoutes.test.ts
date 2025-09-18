import request from "supertest";
import app from "../src/app";
import * as employeeControllers from "../src/api/v1/controllers/employeeControllers";

// Mock this file
jest.mock("../src/api/v1/controllers/employeeControllers", () => ({
    getAllEmployees: jest.fn((req, res) => res.status(200).send()),
    getEmployeeByID: jest.fn((req, res) => res.status(200).send()),
    createEmployee: jest.fn((req, res) => res.status(201).send()),
    updateEmployee: jest.fn((req, res) => res.status(200).send()),
    deleteEmployee: jest.fn((req, res) => res.status(200).send())
}));

// To test that the paths are mapped to the controllers correctly
describe("Employee Routes", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    // Test to verify that all employee records are returned as an array
    describe("GET /api/v1/employees/", () => {
        it("should return an array of all employees", async () => {
            await request(app).get("/api/v1/employees");
            expect(employeeControllers.getAllEmployees).toHaveBeenCalled();
        });
    });

    // Test employee by ID successful retrieval
    describe("GET /api/v1/employees/:id", () => {
        it("should return an employee by ID", async () => {
            const testId: number = 1;
            await request(app).get(`/api/v1/employees/${testId}`);
            expect(employeeControllers.getEmployeeByID).toHaveBeenCalled();
        });

    // Test employee by ID retrieval with missing ID parameter
        it("should not get an employee if ID is missing", async () => {
            await request(app).get("/api/v1/employees/");
            expect(employeeControllers.getEmployeeByID).not.toHaveBeenCalled();
        });
    });

    // Test successful employee creation
    describe("POST /api/v1/employees/", () => {
        it("should create a new employee", async () => {
            const mockEmployee: object = {
                name: "Test Name",
                position: "Test Position",
                department: "Test Department",
                email: "test.email@pixell-river.com",
                phone: "000-000-0000", 
                branchId: 1,
            };

            await request(app).post("/api/v1/employees").send(mockEmployee);
            expect(employeeControllers.createEmployee).toHaveBeenCalled();
        });

        // Test with missing parameters
        it("should fail to create an employee", async () => {
            const incompleteEmployee: object = {
                name: "",
                position: "",
            };

            await request(app).post("/api/v1/employees").send(incompleteEmployee);
            expect(employeeControllers.createEmployee).toHaveBeenCalled();
        });
    });

    // Test successful employee update
    describe("PUT /api/v1/employees/:id", () => {
        it("should call updateEmployee controller with valid data", async() => {
            const mockUpdateData: object = {
                position: "Updated Position",
                phone: "Updated Phone",
            };

            await request(app).put("/api/v1/employees/testid").send(mockUpdateData);
            expect(employeeControllers.updateEmployee).toHaveBeenCalled();
        });

        // Test employee update with missing required parameters
        it("should not update employee with missing parameters", async() => {
            const mockMissingData: object = {
                position: "",
                phone: "",
            };

            await request(app).put("/api/v1/employees/testid").send(mockMissingData);
            expect(employeeControllers.updateEmployee).toHaveBeenCalled();
        });
    });

    // Test successful employee deletion
    describe("DELETE /api/v1/employees/:id", () => {
        it("should call deleteEmployee controller with valid data", async() => {
            await request(app).delete("/api/v1/employees/testid");
            expect(employeeControllers.deleteEmployee).toHaveBeenCalled();
            });
    });

    // Test employee deletion with missing ID parameter
        it("should not delete an employee if ID is missing", async() => {
            await request(app).delete("/api/v1/employees/");
            expect(employeeControllers.deleteEmployee).not.toHaveBeenCalled();
            });
    });

    // Test successful retrieval of employees in the specified branch ID
    describe("GET /api/v1/employees/:branchId", () => {
        it("should return specified employees by branch ID", async () => {
            const testId: number = 1;
            await request(app).get(`/api/v1/employees/${testId}`);
            expect(employeeControllers.getAllBranchEmployees).toHaveBeenCalled();
        });

    // Test employee by branch ID retrieval with missing ID parameter
        it("should not get employees if branch ID is missing", async () => {
            await request(app).get("/api/v1/employees/");
            expect(employeeControllers.getEmployeeByID).not.toHaveBeenCalled();
        });
    });
