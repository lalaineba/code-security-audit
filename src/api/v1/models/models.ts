/**
 * Interface for the Employee structure.
 */
export interface Employee {
    id: number;
    name: string;
    position: string;
    department: string;
    email: string;
    phone: string;
    branchId: number;
}

/**
 * Interface for the Branch structure. 
 */
export interface Branch {
    id: number;
    name: string;
    address: string;
    phone: string;
}

/**

export interface BranchEmployees {
    employeeID: number;
    employeeName: string;
    branchName: string;
}

export interface DepartmentEmployees {
    employeeID: number;
    employeeName: string;
    employeePosition: string;
}
    
 */