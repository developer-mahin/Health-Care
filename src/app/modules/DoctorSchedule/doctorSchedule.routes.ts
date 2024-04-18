import { Router } from "express";
import { DoctorScheduleController } from "./doctorSchedule.controller";
import auth from "../../Middlewares/auth";
import { UserRole } from "@prisma/client";

const router = Router();

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
