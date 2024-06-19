import { Router } from "express";
import { AppointmentControllers } from "./appointment.controller";
import auth from "../../Middlewares/auth";
import { UserRole } from "@prisma/client";
import { ENUM_USER_ROLE } from "../../../enums";
import validateRequest from "../../Middlewares/validateRequest";
import { AppointmentValidation } from "./appointment.validation";

const router = Router();

router.get(
  "/",
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  AppointmentControllers.getAllFromDB
);

router.get(
  "/my-appointments",
  auth(ENUM_USER_ROLE.PATIENT, ENUM_USER_ROLE.DOCTORS),
  AppointmentControllers.getMyAppointment
);

router.post(
  "/",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.DOCTORS),
  validateRequest(AppointmentValidation.createAppointment),
  AppointmentControllers.createAppointment
);

router.post(
  "/status/:id",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.DOCTORS),
  AppointmentControllers.changeAppointmentStatus
);

export const AppointmentRoutes = router;
