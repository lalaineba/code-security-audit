import express, { Router } from "express";
import * as employeeControllers from "../controllers/employeeControllers";


const router: Router = express.Router();

router.get("/", employeeControllers.getAllEmployees);
router.get("/:id", employeeControllers.getEmployeeByID);
router.post("/", employeeControllers.createEmployee);
router.put("/:id", employeeControllers.updateEmployee);
router.delete("/:id", employeeControllers.deleteEmployee);

export default router;