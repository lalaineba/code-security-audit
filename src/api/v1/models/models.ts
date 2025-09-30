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
