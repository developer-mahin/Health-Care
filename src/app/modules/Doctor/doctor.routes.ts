import express from "express";
import { DoctorController } from "./doctor.controller";
import auth from "../../Middlewares/auth";
import { ENUM_USER_ROLE } from "../../../enums";
import validateRequest from "../../Middlewares/validateRequest";
import { DoctorValidation } from "./doctor.validation";

const router = express.Router();

router.get("/", DoctorController.getAllFromDB);

router.get("/:id", DoctorController.getByIdFromDB);

router.patch(
  "/:id",
  auth(
    ENUM_USER_ROLE.SUPER_ADMIN,
    ENUM_USER_ROLE.ADMIN,
    ENUM_USER_ROLE.DOCTORS
  ),
  validateRequest(DoctorValidation.update),
  DoctorController.updateIntoDB
);

router.delete(
  "/:id",
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  DoctorController.deleteFromDB
);

router.delete(
  "/soft/:id",
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  DoctorController.softDelete
);

export const DoctorRoutes = router;
