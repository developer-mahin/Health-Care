import { Router } from "express";
import auth from "../../Middlewares/auth";
import { ENUM_USER_ROLE } from "../../../enums";
import validateRequest from "../../Middlewares/validateRequest";
import { PrescriptionController } from "./prescription.controller";
import { PrescriptionValidation } from "./prescription.validation";

const router = Router();
router.get(
  "/",
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  PrescriptionController.getAllFromDB
);

router.get(
  "/my-prescriptions",
  auth(ENUM_USER_ROLE.PATIENT),
  PrescriptionController.patientPrescriptions
);

router.post(
  "/",
  auth(ENUM_USER_ROLE.DOCTORS),
  validateRequest(PrescriptionValidation.create),
  PrescriptionController.insertIntoDB
);

export const PrescriptionsRoutes = router;
