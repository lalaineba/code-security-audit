import { Employee, employees } from "src/data/employees";

export const getAllEmployees = async(): Promise<Employee[]> => {
    return structuredClone(employees);
};

export const createEmployee = async (employeeData: {
    name: string;
    position: string;
    department: string;
    email: string;
    phone: string;
    branchId: number;
}): Promise<Employee> => {
    // Creating a new employee data with unique generated ID
    const newEmployee: Employee = {
        id: Number((employees.length) + 1),
        name: employeeData.name,
        position: employeeData.position,
        department: employeeData.department,
        email: employeeData.email,
        phone: employeeData.phone,
        branchId: employeeData.branchId,
    };

    // Adds the new employee to the end of the employees array
    employees.push(newEmployee);
    
    return structuredClone(newEmployee);
};

export const getEmployeeByID = async (id: number): Promise<Employee[]> => {
    // in the employee array, find an employee id that's equal to the parameter we received
    const index: number = employees.findIndex((employee: Employee) => employee.id === id);

    // -1 means it didnt find it. There's no index in the array
    if (index === -1) {
        throw new Error(`Employee ID: ${id} not found.`);
    };

    return structuredClone(employees);
};

export const updateEmployee = async (
    id: number,
    // From this Employee object, we can only pick position and/or phone
    employeeData: Pick<Employee, "position" | "phone">
): Promise<Employee> => {
    const index: number = employees.findIndex((employee: Employee) => employee.id === id);

    if (index === -1) {
        throw new Error(`Employee ID: ${id} not found.`);
    };

    // Spread operator: merges any existing item (that we didn't update) with the updated data
    employees[index] = { ...employees[index], ...employeeData };

    return structuredClone(employees[index]);
};

export const deleteEmployee = async (id: number): Promise<void> => {
    const index: number = employees.findIndex((employee: Employee) => employee.id === id);

    if (index === -1) { 
        throw new Error(`Employee ID: ${id} not found.`);
    }

    employees.splice(index, 1);
};
