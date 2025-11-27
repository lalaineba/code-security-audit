import express, { Router } from "express";
import * as branchControllers from "../controllers/branchControllers";
import { validateRequest } from "../middleware/validate";
import { branchSchemas } from "../validations/branchesValidations";

const router: Router = express.Router();

/**
 * @openapi
 * /branches:
 *   get:
 *     summary: Retrieve all branches
 *     tags: [Branches]
 *     responses:
 *       '200':
 *         description: Branches retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Branch'
 */
router.get("/", branchControllers.getAllBranches);

/**
 * @openapi
 * /branches/{id}:
 *   get:
 *     summary: Retrieve a branch by ID
 *     tags: [Branches]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The Firestore document ID of the branch
 *     responses:
 *       '200':
 *         description: Branch retrieved
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Branch'
 *       '500':
 *         description: Branch ID not found.
 */
router.get("/:id", branchControllers.getBranchByID);

/**
 * @openapi
 * /branches:
 *   post:
 *     summary: Create a new branch
 *     tags: [Branches]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               address:
 *                 type: string
 *               phone:
 *                 type: string
 *             required: [name, address, phone]
 *     responses:
 *       '201':
 *         description: Branch created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Branch'
 *       '400':
 *         description: Validation error
 */
router.post(
    "/",
    validateRequest(branchSchemas.create),
    branchControllers.createBranch
);

/**
 * @openapi
 * /branches/{id}:
 *   put:
 *     summary: Update an existing branch
 *     tags: [Branches]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The Firestore document ID of the branch to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               address:
 *                 type: string
 *               phone:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Branch updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Branch'
 *       '400':
 *         description: Validation error
 *       '500':
 *         description: Branch ID not found.
 */
router.put(
    "/:id",
    validateRequest(branchSchemas.update),
    branchControllers.updateBranch
);

/**
 * @openapi
 * /branches/{id}:
 *   delete:
 *     summary: Delete a branch by ID
 *     tags: [Branches]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The Firestore document ID of the branch to delete
 *     responses:
 *       '200':
 *         description: Branch deleted successfully
 *       '500':
 *         description: Branch ID not found.
 */
router.delete(
    "/:id",
    validateRequest(branchSchemas.delete),
    branchControllers.deleteBranch
);

export default router;