import express, { Router } from "express";
import * as employeeControllers from "../controllers/employeeControllers";


const router: Router = express.Router();

router.get("/employees", employeeControllers.getAllEmployees);
router.get("/employees/:id", employeeControllers.getEmployeeByID);
router.post("/employees", employeeControllers.createEmployee);
router.put("/employees/:id", employeeControllers.updateEmployee);
router.delete("/employees/:id", employeeControllers.deleteEmployee);

export default router;