import request from "supertest";
import app from "../src/app";
import * as employeeControllers from "../src/api/v1/controllers/employeeControllers";

// Mock this file
jest.mock("../src/api/v1/controllers/employeeControllers", () => ({
    getAllEmployees: jest.fn((req, res) => res.status(200).send()),
    getEmployeeByID: jest.fn((req, res) => res.status(200).send()),
    createEmployee: jest.fn((req, res) => res.status(201).send()),
    updateEmployee: jest.fn((req, res) => res.status(200).send()),
    deleteEmployee: jest.fn((req, res) => res.status(200).send()),
    getAllBranchEmployees: jest.fn((req, res) => res.status(200).send()),
    getDepartmentEmployees: jest.fn((req, res) => res.status(200).send())
}));

// To test that the defined routes are mapped to the controllers correctly
describe("Employee Routes", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    // Test that the getAllEmployees controller gets called when the route is called
    describe("GET /api/v1/employees/", () => {
        it("should call getAllEmployees controller", async () => {
            await request(app).get("/api/v1/employees");
            expect(employeeControllers.getAllEmployees).toHaveBeenCalled();
        });
    });

    // Test that the getEmployeeByID controller gets called correctly
    describe("GET /api/v1/employees/:id", () => {
        it("should call getEmployeeByID controller", async () => {
            await request(app).get("/api/v1/employees/tesdtId");
            expect(employeeControllers.getEmployeeByID).toHaveBeenCalled();
        });
    });

    // Test that the createEmployee controller gets called correctly
    describe("POST /api/v1/employees/", () => {
        it("should call createEmployee controller with valid data", async () => {
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
    });

    // Test that the updateEmployee controller gets called correctly
    describe("PUT /api/v1/employees/:id", () => {
        it("should call updateEmployee controller with valid data", async() => {
            const mockUpdateData: object = {
                position: "Updated Position",
                phone: "Updated Phone",
            };

            await request(app).put("/api/v1/employees/testId").send(mockUpdateData);
            expect(employeeControllers.updateEmployee).toHaveBeenCalled();
        });
    });

    // Test that the deleteEmployee controller gets called correctly
    describe("DELETE /api/v1/employees/:id", () => {
        it("should call deleteEmployee controller", async() => {
            await request(app).delete("/api/v1/employees/testid");
            expect(employeeControllers.deleteEmployee).toHaveBeenCalled();
            });
    });

    // Test that the getAllBranchEmployees controller gets called correctly
    describe("GET /api/v1/employees/branch/:branchId", () => {
        it("should call getAllBranchEmployees controller", async () => {
            await request(app).get("/api/v1/employees/branch/testBranchID");
            expect(employeeControllers.getAllBranchEmployees).toHaveBeenCalled();
        });
    });

    // Test that the getDepartmentEmployees controller gets called correctly
    describe("GET /api/v1/employees/department/:department", () => {
        it("should call getDepartmentEmployees controller", async () => {
            await request(app).get("/api/v1/employees/department/testDepartment");
            expect(employeeControllers.getDepartmentEmployees).toHaveBeenCalled();
        });
    });
});
