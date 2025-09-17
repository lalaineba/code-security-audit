import express, { Router } from "express";
import * as branchControllers from "../controllers/branchControllers";


const router: Router = express.Router();

/**
 * Defining routes for Branch management
 */
router.get("/", branchControllers.getAllBranches);
router.get("/:id", branchControllers.getBranchByID);


export default router;