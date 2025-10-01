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

import { employeeSchemas } from "../validations/employeeValidations";
import { validateRequest } from "../middleware/validate";

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
                /*
                name: data.name,
                position: data.position,
                department: data.department,
                email: data.email,
                phone: data.phone,
                branchId: data.branchId,
                */
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
 */
export const createEmployee = async (employeeData: {
    name: string;
    position: string;
    department: string;
    email: string;
    phone: string;
    branchId: number;
}): Promise<Employee> => {
    // Creating a new employee data with unique generated ID
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
export const getEmployeeByID = async (id: number): Promise<Employee> => {
    const allEmployees: Employee[] = await getAllEmployees(); 
    // in the employee array, find an employee id that's equal to the parameter we received
    const employee: Employee | undefined = allEmployees.find((employee: Employee) => employee.id === id);

    // !employee means no employee with that deisignated ID in the array
    if (!employee) {
        throw new Error(`Employee ID: ${id} not found.`);
    };

    return structuredClone(employee);
};

/**
 * Updates an existing employee
 * @param id The ID of the employee to update
 * @param employeeData The fields to update (position and/or phone)
 * @returns The new updated employee data
 * @throws An error if employee ID is not found
 */
export const updateEmployee = async (
    id: number,
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

        await updateDocument<Employee>(COLLECTION, id.toString(), updateEmployee);

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
export const deleteEmployee = async (id: number): Promise<void> => {
    const index: number = employees.findIndex((employee: Employee) => employee.id === id);

    if (index === -1) { 
        throw new Error(`Employee ID: ${id} not found.`);
    }
    // Splice() removes the employee from the array by deleting the employee at the found index
    employees.splice(index, 1);
};

/**
 * Gets all employees from the specified branch 
 * @param id The ID of the branch to retrieve
 * @throws An error if branch ID is not found
 */
export const getAllBranchEmployees = async (branchId: number): Promise<Employee[]> => {
    const allEmployees: Employee[] = await getAllEmployees();
    // filter() goes through each employee and checks if their branchID is equals to the given branchID
    // If yes, the employee is added to the new branchEmployees array
    const branchEmployees: Employee[] = allEmployees.filter((employee: Employee) => employee.branchId === branchId);
    // if the array is empty, it means that branch ID doesn't exist
    if (branchEmployees.length === 0) {
        throw new Error(`Branch ID: ${branchId} not found.`);
    };

    return structuredClone(branchEmployees);
};

/**
 * Gets all employees from the specified department 
 * @param id The name of the department to retrieve
 * @throws An error if department is not found
 */
export const getDepartmentEmployees = async (department: string): Promise<Employee[]> => {
    const allEmployees: Employee[] = await getAllEmployees();
    const departmentEmployees: Employee[] = allEmployees.filter(
        (employee: Employee) => employee.department.toLowerCase() === department.toLowerCase()
    );

    if (departmentEmployees.length === 0) {
        throw new Error(`Department name: ${department} not found.`);
    };

    return structuredClone(departmentEmployees);
};