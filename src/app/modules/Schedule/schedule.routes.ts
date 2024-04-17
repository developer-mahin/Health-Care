import { Router } from "express";
import { ScheduleController } from "./schedule.controller";
import auth from "../../Middlewares/auth";
import { ENUM_USER_ROLE } from "../../../enums";

const router = Router();

router.get(
  "/",
  auth(
    ENUM_USER_ROLE.SUPER_ADMIN,
    ENUM_USER_ROLE.ADMIN,
    ENUM_USER_ROLE.DOCTORS
  ),
  ScheduleController.getAllFromDB
);

router.post("/", ScheduleController.createSchedule);

export const ScheduleRoutes = router;
