import { Router } from "express";
import { userControllers } from "./user.controller";
import auth from "../../Middlewares/auth";
import { UserRole } from "@prisma/client";

const router = Router();

router.post(
  "/create-admin",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  userControllers.createAdmin
);

export const userRoutes = router;
