import express, { Router } from "express";
import * as employeeControllers from "../controllers/employeeControllers";
import { validateRequest } from "../middleware/validate";
import { employeeSchemas } from "../validations/employeeValidations";


const router: Router = express.Router();

/**
 * Defining routes for Employee management
 */
router.get("/", employeeControllers.getAllEmployees);
router.get("/:id", employeeControllers.getEmployeeByID);

router.post(
    "/",
    validateRequest(employeeSchemas.create),
    employeeControllers.createEmployee
);
router.put(
    "/:id",
    validateRequest(employeeSchemas.update),
    employeeControllers.updateEmployee
);
router.delete(
    "/:id",
    validateRequest(employeeSchemas.delete),
    employeeControllers.deleteEmployee);

/**
 * Additional endpoints for operations between employees, branches, and departments
 */
router.get("/branch/:branchId", employeeControllers.getAllBranchEmployees);
router.get("/department/:department", employeeControllers.getDepartmentEmployees);

export default router;