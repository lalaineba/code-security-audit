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
        const mockQuerySnapshot: object = {
            docs: [
                {
                    id: mockEmployeeData.id,
                    // data() method returns the document's data (employee fields)
                    data: (): Partial<Employee> => ({
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
    });

    // Test for createEmployees service
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

    // Test for getEmployeeById service
    it("should successfully get an employee by id", async () => {
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
        const mockDocumentSnapshot: object = {
            id: mockEmployeeData.id,
            // data() method returns the document's data (employee fields)
            data: (): Partial<Employee> => ({
                name: mockEmployeeData.name,
                position: mockEmployeeData.position,
                department: mockEmployeeData.department,
                email: mockEmployeeData.email,
                phone: mockEmployeeData.phone,
                branchId: mockEmployeeData.branchId,
            }),
        };

        (firestoreRepository.getDocumentById as jest.Mock).mockResolvedValue(
            mockDocumentSnapshot
        );
        
        // Act
        const result: Employee = await employeeServices.getEmployeeByID(
            mockEmployeeData.id
        );

        // Assert
        expect(firestoreRepository.getDocumentById).toHaveBeenCalledWith(
            "employees",
            mockEmployeeData.id
            );
        expect(result).toEqual(mockEmployeeData);
    });
    
    // Test for updateEmployee service
    it("should successfully update an employee", async () => {
        // Arrange
        const mockDocumentId: string = "test-employee-id";
        const mockEmployee: Employee = {
            id: mockDocumentId,
            name: "Test Name",
            position: "Updated Position",
            department: "Test Department",
            email: "test@email.com",
            phone: "111-111-1111",
            branchId: 1,
            };
        
        // Creates a mock for getEmployeeByID service's method
        jest.spyOn(employeeServices, "getEmployeeByID").mockResolvedValue(mockEmployee);

        (firestoreRepository.updateDocument as jest.Mock).mockResolvedValue(
            undefined
        );

        // Act
        await employeeServices.updateEmployee(mockDocumentId, mockEmployee);

        // Assert
        expect(employeeServices.getEmployeeByID).toHaveBeenCalledWith(
            mockDocumentId
        );
        expect(firestoreRepository.updateDocument).toHaveBeenCalledWith(
            "employees",
            mockDocumentId,
            expect.objectContaining({
                ...mockEmployee,
            })
        );
    });

    // Test for deleteEmployee service
    it("should successfully delete an employee by id", async () => {
        // Arrange
        const mockDocumentId: string = "test-employee-id";
        const mockEmployee: Employee = {
            id: mockDocumentId,
            name: "Test Name",
            position: "Test Position",
            department: "Test Department",
            email: "test@email.com",
            phone: "000-000-0000",
            branchId: 1,
            };
        
        // Creates a mock for getEmployeeByID service's method
        jest.spyOn(employeeServices, "getEmployeeByID").mockResolvedValue(mockEmployee);

        (firestoreRepository.deleteDocument as jest.Mock).mockResolvedValue(
            undefined
        );

        // Act
        await employeeServices.deleteEmployee(mockDocumentId);

        // Assert
        expect(employeeServices.getEmployeeByID).toHaveBeenCalledWith(mockDocumentId);
        expect(firestoreRepository.deleteDocument).toHaveBeenCalledWith(
            "employees",
            mockDocumentId
        );
    });

    // Test for getAllBranchEmployees service
    it("should successfully get specified employees by branch ID", async () => {
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
        const mockDocumentSnapshot: object = {
            id: mockEmployeeData.id,
            // data() method returns the document's data (employee fields)
            data: (): Partial<Employee> => ({
                name: mockEmployeeData.name,
                position: mockEmployeeData.position,
                department: mockEmployeeData.department,
                email: mockEmployeeData.email,
                phone: mockEmployeeData.phone,
                branchId: mockEmployeeData.branchId,
            }),
        };

        (firestoreRepository.getDocuments as jest.Mock).mockResolvedValue({
            docs:[mockDocumentSnapshot]           
        });
        
        // Act
        const result: Employee[] = await employeeServices.getAllBranchEmployees(
            mockEmployeeData.branchId
        );

        // Assert
        expect(firestoreRepository.getDocuments).toHaveBeenCalledWith("employees");
        expect(result).toEqual([mockEmployeeData]);
    });

    // Test for getDepartmentEmployees service
    it("should successfully get specified employees by department", async () => {
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
        const mockDocumentSnapshot: object = {
            id: mockEmployeeData.id,
            // data() method returns the document's data (employee fields)
            data: (): Partial<Employee> => ({
                name: mockEmployeeData.name,
                position: mockEmployeeData.position,
                department: mockEmployeeData.department,
                email: mockEmployeeData.email,
                phone: mockEmployeeData.phone,
                branchId: mockEmployeeData.branchId,
            }),
        };

        (firestoreRepository.getDocuments as jest.Mock).mockResolvedValue({
            docs:[mockDocumentSnapshot]           
        });
        
        // Act
        const result: Employee[] = await employeeServices.getDepartmentEmployees(
            mockEmployeeData.department
        );

        // Assert
        expect(firestoreRepository.getDocuments).toHaveBeenCalledWith("employees");
        expect(result).toEqual([mockEmployeeData]);
    });
});