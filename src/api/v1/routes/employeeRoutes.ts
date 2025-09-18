import express, { Router } from "express";
import * as employeeControllers from "../controllers/employeeControllers";


const router: Router = express.Router();

/**
 * Defining routes for Employee management
 */
router.get("/", employeeControllers.getAllEmployees);
router.get("/:id", employeeControllers.getEmployeeByID);
router.post("/", employeeControllers.createEmployee);
router.put("/:id", employeeControllers.updateEmployee);
router.delete("/:id", employeeControllers.deleteEmployee);

/**
 * Additional endpoints for operations between employees, branches, and departments
 */
router.get("/:branchId", employeeControllers.getAllBranchEmployees);
router.get("/:department", employeeControllers.getDepartmentEmployees);


export default router;