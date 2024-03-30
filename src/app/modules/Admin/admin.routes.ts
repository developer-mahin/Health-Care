import { Router } from "express";
import { adminControllers } from "./admin.controller";
import validateRequest from "../../Middlewares/validateRequest";
import { adminValidationSchema } from "./admin.validation";
import auth from "../../Middlewares/auth";
import { UserRole } from "@prisma/client";

const router = Router();

router.get(
  "/",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  adminControllers.getAllAdmins
);

router.get(
  "/:id",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  adminControllers.getSingleAdmin
);

router.patch(
  "/:id",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  validateRequest(adminValidationSchema.updateAdmin),
  adminControllers.updateAdmin
);

router.delete(
  "/:id",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  adminControllers.deleteAdmin
);

router.delete(
  "/soft/:id",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  adminControllers.softDeleteAdmin
);

export const adminRoutes = router;
