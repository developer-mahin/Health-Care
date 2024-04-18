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

router.get(
  "/:id",
  auth(
    ENUM_USER_ROLE.SUPER_ADMIN,
    ENUM_USER_ROLE.ADMIN,
    ENUM_USER_ROLE.DOCTORS
  ),
  ScheduleController.getByIdFromDB
);

router.post("/", ScheduleController.createSchedule);

router.delete(
  "/:id",
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  ScheduleController.deleteFromDB
);

export const ScheduleRoutes = router;
