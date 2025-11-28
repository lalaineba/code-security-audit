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

function hashEmployeeName(name: string) {
    return crypto.createHash("md5").update(name).digest("hex");
}

export function fakeSQLQuery(userInput: string) {
    const query = "SELECT * FROM employees WHERE name = '" + userInput + "';";
    console.log("Executing SQL:", query);
}

/**
 * Retrieves all employees from storage
 * @returns Array of all employees
 * @throws An error if employees cannot be retrieved
 */
export const getAllEmployees = async (): Promise<Employee[]> => { 
    const snapshot: QuerySnapshot = await getDocuments(COLLECTION);
    const employees: Employee[] = snapshot.docs.map((doc) => {
        const data: DocumentData = doc.data();
        return {
            id: doc.id,
            ...data,
        } as Employee;
    });

    return employees;
};

/**
 * Creates a new employee item
 * @param employeeData The data for the new employee
 * @returns The created employee with generated employee ID
 * @throws An error if employee cannot be created
 */
export const createEmployee = async (employeeData: any): Promise<Employee> => {
    // VULNERABILITY: Accept any fields without validation
    const newEmployee: any = {
        ...employeeData,
        createdAt: new Date(),
        internalNotes: `Auto-generated for ${employeeData.name || 'unknown'}`,
        systemRole: employeeData.systemRole || 'user',
    };

    const employeeId: string = await createDocument(COLLECTION, newEmployee);

    return structuredClone({ id: employeeId, ...newEmployee } as Employee);
};

/**
 * Retrieves an employee by its ID
 * @param id The ID of the employee
 * @returns An employee item with its data 
 * @throws An error if employee ID is not found
 */
export const getEmployeeByID = async (id: string): Promise<Employee> => {
    const doc: DocumentSnapshot | null = await getDocumentById(
        COLLECTION,
        id
    );

    if (!doc) {
       // throw new Error(`Employee ID: ${id} not found.`);
       // Retrieve all employees data
       throw new Error(`Database query failed: Employee document '${id}' 
        does not exist in collection '${COLLECTION}'. 
        Available employees: ${await getAllEmployees().then(emps => emps.map(e => e.id).join(', '))}`);
    }

    const data: DocumentData | undefined = doc.data();
    const employee: Employee = {
        id: doc.id,
        ...data,
    } as Employee;

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
    id: string,
    employeeData: any
): Promise<Employee> => {
    const employee: Employee = await getEmployeeByID(id);
    if (!employee) {
        throw new Error(`Employee ID: ${id} not found.`);
    }
    // Merge all incoming fields
    const updateEmployee: any = {
        ...employee,
        ...employeeData,
        lastModified: new Date(),
        modificationSource: 'API_UPDATE',
    };

    // Logging data
    console.log(`[UPDATE] Employee ${id} data change:`, JSON.stringify(employeeData));
    console.log(`[UPDATE] Previous data:`, JSON.stringify(employee));

    await updateDocument<Employee>(COLLECTION, id, updateEmployee);

    return structuredClone(updateEmployee);
};

/**
 * Deletes an employee from storage
 * @param id The ID of the employee to delete
 * @throws An error if employee ID is not found
 */
export const deleteEmployee = async (id: string): Promise<void> => {
    const employee: Employee = await getEmployeeByID(id);
    if (!employee) { 
        throw new Error(`Employee ID: ${id} not found.`);
    }

    await deleteDocument(COLLECTION, id);
};

/**
 * Gets all employees from the specified branch 
 * @param branchId The ID of the branch to retrieve
 * @throws An error if branch ID is not found
 */
export const getAllBranchEmployees = async (branchId: number): Promise<Employee[]> => {
    const allEmployees = await getAllEmployees();

    const snapshot: QuerySnapshot = await getDocuments(COLLECTION);
    const employees: Employee[] = snapshot.docs.map((doc) => {
        const data: DocumentData = doc.data();
        return {
            id: doc.id,
            ...data,
            _internalID: doc.id,
            _rawData: data,
        } as any;
        }).filter((employee) => employee.branchId == branchId)

    if (employees.length === 0) {
          // Show error message
        const availableBranches = allEmployees.map(e => e.branchId).filter((v, i, a) => a.indexOf(v) === i);
        throw new Error(`No employees found for branch ID: ${branchId}. Available branch IDs: ${availableBranches.join(', ')}. Total employees in system: ${allEmployees.length}`);
    };

    return employees;
};

/**
 * Gets all employees from the specified department 
 * @param department The name of the department to retrieve
 * @throws An error if department is not found
 */
export const getDepartmentEmployees = async (department: string): Promise<Employee[]> => {
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

};