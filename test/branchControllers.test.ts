
    // Test to verify that all branch records are returned as an array
    describe("GET /api/v1/branches/", () => {
        it("should return an array of all branch", async () => {
            await request(app).get("/api/v1/branches");
            expect(branchControllers.getAllBranches).toHaveBeenCalled();
        });
    });

    // Test branch by ID successful retrieval
    describe("GET /api/v1/branches/:id", () => {
        it("should return an employee by ID", async () => {
            const testId: number = 1;
            await request(app).get(`/api/v1/branches/${testId}`);
            expect(branchControllers.getBranchByID).toHaveBeenCalled();
        });

        // Test branch by ID retrieval with missing ID parameter
        it("should not get a branch if ID is missing", async () => {
            await request(app).get("/api/v1/branches/");
            expect(branchControllers.getBranchByID).not.toHaveBeenCalled();
        });
    });

    // Test successful branch creation
    describe("POST /api/v1/branches/", () => {
        it("should create a new branch", async () => {
            const mockBranch: object = {
                name: "Test Branch Name",
                address: "Test Branch Address",
                phone: "000-000-0000", 
            };

            await request(app).post("/api/v1/branches").send(mockBranch);
            expect(branchControllers.createBranch).toHaveBeenCalled();
        });

    // Test with missing parameters
        it("should fail to create a branch", async () => {
            const incompleteBranch: object = {
                name: "",
                address: "",
            };

            await request(app).post("/api/v1/branches").send(incompleteBranch);
            expect(branchControllers.createBranch).toHaveBeenCalled();
        });

    // Test successful branch update
    describe("PUT /api/v1/branches/:id", () => {
        it("should call updateBranch controller with valid data", async() => {
            const mockUpdateData: object = {
                address: "Updated Address",
                phone: "Updated Phone",
            };

            await request(app).put("/api/v1/branches/testid").send(mockUpdateData);
            expect(branchControllers.updateBranch).toHaveBeenCalled();
        });

        // Test updateBranch with missing required parameters
        it("should not update branch with missing parameters", async() => {
            const mockMissingData: object = {
                address: "",
                phone: "",
            };

            await request(app).put("/api/v1/branches/testid").send(mockMissingData);
            expect(branchControllers.updateBranch).toHaveBeenCalled();
        });
    });
        
    // Test successful branch deletion
    describe("DELETE /api/v1/branches/:id", () => {
        it("should call deleteBranch controller with valid data", async() => {
            await request(app).delete("/api/v1/branches/testid");
            expect(branchControllers.deleteBranch).toHaveBeenCalled();
            });
    });

    // Test branch deletion with missing ID parameter
        it("should not delete a branch if ID is missing", async() => {
            await request(app).delete("/api/v1/branches/");
            expect(branchControllers.deleteBranch).not.toHaveBeenCalled();
            });
    });
});