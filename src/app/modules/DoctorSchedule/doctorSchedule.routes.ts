import { UserRole } from "@prisma/client";
import { Router } from "express";
import auth from "../../Middlewares/auth";
import { DoctorScheduleController } from "./doctorSchedule.controller";

const router = Router();

router.get(
  "/",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.DOCTORS, UserRole.PATIENT),
  DoctorScheduleController.getAllFromDB
);

router.get(
  "/my-schedule",
  auth(UserRole.DOCTORS),
  DoctorScheduleController.getDoctorsSchedule
);

router.post(
  "/",
  auth(UserRole.DOCTORS),
  DoctorScheduleController.createDoctorSchedule
);

router.delete(
  "/:id",
  auth(UserRole.DOCTORS),
  DoctorScheduleController.deleteDoctorSchedule
);

export const DoctorScheduleRoutes = router;
