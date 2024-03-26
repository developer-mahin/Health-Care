import { Router } from "express";
import { adminControllers } from "./admin.controller";

const router = Router();

router.get("/", adminControllers.getAllAdmins);

export const adminRoutes = router;
