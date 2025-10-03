import * as employeeServices from "../src/api/v1/services/employeeServices";
import * as firestoreRepository from "../src/api/v1/repositories/firestoreRepository";
import { Employee } from "../src/api/v1/models/models";

// Mock the repository module
jest.mock("../src/api/v1/repositories/firestoreRepository");

describe("Employee Service", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    // Test for getAllEmployees service
    it("should successfully get all employees", async () => {
        // Arrange
        const mockEmployeeData: {
            id: string;
            name: string;
            position: string;
            department: string;
            email: string;
            phone: string;
            branchId: number;
        } = {
            id: "employee1",
            name: "Test Name",
            position: "Test Position",
            department: "Test Department",
            email: "test@email.com",
            phone: "000-000-0000",
            branchId: 1,
        }; 
        // Create a mock object that looks like what Firestore should return
        const mockQuerySnapshot = {
            docs: [
                {
                    id: mockEmployeeData.id,
                    // data() method returns the document's data (employee fields)
                    data: () => ({
                        name: mockEmployeeData.name,
                        position: mockEmployeeData.position,
                        department: mockEmployeeData.department,
                        email: mockEmployeeData.email,
                        phone: mockEmployeeData.phone,
                        branchId: mockEmployeeData.branchId,
                    }),
                }
            ],
        };
        (firestoreRepository.getDocuments as jest.Mock).mockResolvedValue(
            mockQuerySnapshot
        );

        // Act
        const result: Employee[] = await employeeServices.getAllEmployees();

        // Assert
        expect(firestoreRepository.getDocuments).toHaveBeenCalledWith("employees");
        expect(result).toEqual([mockEmployeeData]);

    })

    it("should successfully create an employee", async () => {
        // Arrange
        const mockEmployeeData: {
            name: string;
            position: string;
            department: string;
            email: string;
            phone: string;
            branchId: number;
        } = {
            name: "Test Name",
            position: "Test Position",
            department: "Test Department",
            email: "test@email.com",
            phone: "000-000-0000",
            branchId: 1,
        };
        const mockDocumentId: string = "test-employee-id";

        (firestoreRepository.createDocument as jest.Mock).mockResolvedValue(
            mockDocumentId
        );

        // Act
        const result: Employee = await employeeServices.createEmployee(mockEmployeeData);

        // Assert
        expect(firestoreRepository.createDocument).toHaveBeenCalledWith(
            "employees",
            expect.objectContaining({
                name: mockEmployeeData.name,
                position: mockEmployeeData.position,
                department: mockEmployeeData.department,
                email: mockEmployeeData.email,
                phone: mockEmployeeData.phone,
                branchId: mockEmployeeData.branchId,
            })
        );
        expect(result.id).toBe(mockDocumentId);
        // Just to make sure that the returned employee object contains the correct name created
        expect(result.name).toBe(mockEmployeeData.name);
    });
});