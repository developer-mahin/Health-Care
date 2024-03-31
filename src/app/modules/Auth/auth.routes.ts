import { Router } from "express";
import { AuthController } from "./auth.controller";
import auth from "../../Middlewares/auth";
import { UserRole } from "@prisma/client";

const router = Router();

router.post("/login", AuthController.loginUser);

router.post("/refresh-token", AuthController.refreshToken);

router.post(
  "/change-password",
  auth(
    UserRole.SUPER_ADMIN,
    UserRole.ADMIN,
    UserRole.DOCTORS,
    UserRole.PATIENT
  ),
  AuthController.changePassword
);

router.post("/forgot-password", AuthController.forgotPassword);
router.post("/reset-password", AuthController.resetPassword);

export const AuthRoutes = router;
