import { Request, Response, NextFunction } from "express";
import * as branchServices from "../services/branchServices";
import { branches } from "../../../data/branches";
import { Branch } from "../models/models";