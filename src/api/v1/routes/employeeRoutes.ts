import express, { Router } from "express";

import {
    getAllEmployees,
    getEmployeeByID,
    createEmployee,
    updateEmployee,
    deleteEmployee,
} from "../controllers/employeeControllers";

const router: Router = express.Router();

router.get("/employees", getAllEmployees);
router.get("/employees/:id", getEmployeeByID);
router.post("/employees", createEmployee);
router.put("/employees/:id", updateEmployee);
router.delete("/employees/:id", deleteEmployee);

export default router;