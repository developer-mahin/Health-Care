import { Router } from "express";
import { adminControllers } from "./admin.controller";
import validateRequest from "../../Middlewares/validateRequest";
import { adminValidationSchema } from "./admin.validation";

const router = Router();

router.get("/", adminControllers.getAllAdmins);

router.get("/:id", adminControllers.getSingleAdmin);

router.patch(
  "/:id",
  validateRequest(adminValidationSchema.updateAdmin),
  adminControllers.updateAdmin
);

router.delete("/:id", adminControllers.deleteAdmin);
router.delete("/soft/:id", adminControllers.softDeleteAdmin);

export const adminRoutes = router;
