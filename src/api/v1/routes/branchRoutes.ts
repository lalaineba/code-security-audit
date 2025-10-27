import express, { Router } from "express";
import * as branchControllers from "../controllers/branchControllers";
import { validateRequest } from "../middleware/validate";
import { branchSchemas } from "../validations/branchesValidations";

const router: Router = express.Router();

/**
 * Defining routes for Branch management
 */
router.get("/", branchControllers.getAllBranches);
router.get("/:id", branchControllers.getBranchByID);

router.post(
    "/",
    validateRequest(branchSchemas.create),
    branchControllers.createBranch
);
router.put(
    "/:id",
    validateRequest(branchSchemas.update),
    branchControllers.updateBranch
);
router.delete(
    "/:id",
    validateRequest(branchSchemas.delete),
    branchControllers.deleteBranch
);

export default router;