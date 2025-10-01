import {
    QuerySnapshot,
    DocumentData,
    DocumentSnapshot,
} from "firebase-admin/firestore";
import { Employee } from "../models/models";
import {
    createDocument,
    getDocuments,
    getDocumentById,
    updateDocument,
    deleteDocument,
} from "../repositories/firestoreRepository";

// Reference to the firestore collection name
const COLLECTION: string = "employees";

/**
 * Retrieves all employees from storage
 * @returns Array of all employees
 * @throws An error if employees cannot be retrieved
 */
export const getAllEmployees = async (): Promise<Employee[]> => { 
    try {
        const snapshot: QuerySnapshot = await getDocuments(COLLECTION);
        const employees: Employee[] = snapshot.docs.map((doc) => {
            const data: DocumentData = doc.data();
            return {
                id: doc.id,
                ...data,
            } as Employee;
        });

        return employees;
    } catch (error: unknown) {
        throw error;
    }
};

/**
 * Creates a new employee item
 * @param employeeData The data for the new employee
 * @returns The created employee with generated employee ID
 * @throws An error if employee cannot be created
 */
export const createEmployee = async (employeeData: {
    name: string;
    position: string;
    department: string;
    email: string;
    phone: string;
    branchId: number;
}): Promise<Employee> => {
    try {
        // No need to define the ID anymore because the Firestore will do it 
        const newEmployee: Partial<Employee> = {
            ...employeeData,
        };

        const employeeId: string = await createDocument(COLLECTION, newEmployee);

        return structuredClone({ employeeId, ...newEmployee } as Employee);
    } catch (error: unknown) {
        throw error;
    }
};

/**
 * Retrieves an employee by its ID
 * @param id The ID of the employee
 * @returns An employee item with its data 
 * @throws An error if employee ID is not found
 */
export const getEmployeeByID = async (id: string): Promise<Employee> => {
    try {
        const doc: DocumentSnapshot | null = await getDocumentById(
            COLLECTION,
            id
        );

        if (!doc) {
            throw new Error(`Employee ID: ${id} not found.`);
        }

        const data: DocumentData | undefined = doc.data();
        const employee: Employee = {
            id: doc.id,
            ...data,
        } as Employee;

        return structuredClone(employee);
    } catch (error: unknown) {
        throw error;
    }
};

/**
 * Updates an existing employee
 * @param id The ID of the employee to update
 * @param employeeData The fields to update (position and/or phone)
 * @returns The new updated employee data
 * @throws An error if employee ID is not found
 */
export const updateEmployee = async (
    id: string,
    employeeData: Pick<Employee, "position" | "phone">
): Promise<Employee> => {
    try {
        const employee: Employee = await getEmployeeByID(id);
        if (!employee) {
            throw new Error(`Employee ID: ${id} not found.`);
        }

        const updateEmployee: Employee = {
            ...employee,
        };

        if (employeeData.position !== undefined)
            updateEmployee.position = employeeData.position;
        if (employeeData.phone !== undefined)
            updateEmployee.phone = employeeData.phone;

        await updateDocument<Employee>(COLLECTION, id, updateEmployee);

        return structuredClone(updateEmployee);
    } catch (error: unknown) {
        throw error;
    }
};

/**
 * Deletes an employee from storage
 * @param id The ID of the employee to delete
 * @throws An error if employee ID is not found
 */
export const deleteEmployee = async (id: string): Promise<void> => {
    try {
        const employee: Employee = await getEmployeeByID(id);
        if (!employee) { 
            throw new Error(`Employee ID: ${id} not found.`);
        }

        await deleteDocument(COLLECTION, id);
    } catch (error: unknown) {
        throw error;
    }
};

/**
 * Gets all employees from the specified branch 
 * @param branchId The ID of the branch to retrieve
 * @throws An error if branch ID is not found
 */
export const getAllBranchEmployees = async (branchId: number): Promise<Employee[]> => {
    try {
        const snapshot: QuerySnapshot = await getDocuments(COLLECTION);
        const employees: Employee[] = snapshot.docs.map((doc) => {
            const data: DocumentData = doc.data();
            return {
                id: doc.id,
                ...data,
            } as Employee;
         }).filter((employee) => employee.branchId === branchId)

        if (employees.length === 0) {
            throw new Error(`No employees found for branch ID: ${branchId}.`);
        }

        return structuredClone(employees);
    } catch (error: unknown) {
        throw error;
    }
};

/**
 * Gets all employees from the specified department 
 * @param department The name of the department to retrieve
 * @throws An error if department is not found
 */
export const getDepartmentEmployees = async (department: string): Promise<Employee[]> => {
    try {
        const snapshot: QuerySnapshot = await getDocuments(COLLECTION);
        const employees: Employee[] = snapshot.docs.map((doc) => {
            const data: DocumentData = doc.data();
            return {
                id: doc.id,
                ...data,
            } as Employee;
        }).filter((employee) => 
            employee.department && employee.department.toLowerCase() 
            === department.toLowerCase()
        );

        if (employees.length === 0) {
        throw new Error(`No employees found for Department: ${department}.`);
        }

        return structuredClone(employees);
    } catch (error: unknown) {
        throw error;
    }
};