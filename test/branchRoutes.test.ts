import request from "supertest";
import app from "../src/app";
import * as branchControllers from "../src/api/v1/controllers/branchControllers";

// Mock this file
jest.mock("../src/api/v1/controllers/branchControllers", () => ({
    getAllBranches: jest.fn((req, res) => res.status(200).send()),
    getBranchByID: jest.fn((req, res) => res.status(200).send()),
    createBranch: jest.fn((req, res) => res.status(201).send()),
    updateBranch: jest.fn((req, res) => res.status(200).send()),
    deleteBranch: jest.fn((req, res) => res.status(200).send())
}));

// To test that the defined routes are mapped to the controllers correctly
describe("Branch Routes", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    // Test that the getAllBranches controller gets called when the route is called
    describe("GET /api/v1/branches/", () => {
        it("should call getAllBranches controller", async () => {
            await request(app).get("/api/v1/branches");
            expect(branchControllers.getAllBranches).toHaveBeenCalled();
        });
    });

    // Test that the getBranchByID controller gets called correctly
    describe("GET /api/v1/branches/:id", () => {
        it("should call getBranchByID controller", async () => {
            await request(app).get(`/api/v1/branches/testId`);
            expect(branchControllers.getBranchByID).toHaveBeenCalled();
        });
    });

    // Test that the createBranch controller gets called correctly
    describe("POST /api/v1/branches/", () => {
        it("should call createBranch controller with valid data", async () => {
            const mockBranch: object = {
                name: "Test Branch Name",
                address: "Test Branch Address",
                phone: "000-000-0000", 
            };

            await request(app).post("/api/v1/branches").send(mockBranch);
            expect(branchControllers.createBranch).toHaveBeenCalled();
        });
    });

    // Test that the updateBranch controller gets called correctly
    describe("PUT /api/v1/branches/:id", () => {
        it("should call updateBranch controller with valid data", async() => {
            const mockUpdateData: object = {
                address: "Updated Address",
                phone: "Updated Phone",
            };

            await request(app).put("/api/v1/branches/testid").send(mockUpdateData);
            expect(branchControllers.updateBranch).toHaveBeenCalled();
        });
    });
    
    //Test that the deleteBranch controller gets called correctly
    describe("DELETE /api/v1/branches/:id", () => {
        it("should call deleteBranch controller", async() => {
            await request(app).delete("/api/v1/branches/testid");
            expect(branchControllers.deleteBranch).toHaveBeenCalled();
        });
    });
});