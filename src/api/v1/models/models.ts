/**
 * Interface for the Employee structure.
 */
export interface Employee {
    id: string;
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
    id: string;
    name: string;
    address: string;
    phone: string;
}
