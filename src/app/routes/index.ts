import { Router } from "express";
import { userRoutes } from "../modules/User/user.routes";
import { adminRoutes } from "../modules/Admin/admin.routes";
import { AuthRoutes } from "../modules/Auth/auth.routes";
import { SpecialtiesRoutes } from "../modules/Specialties/specialties.routes";
import { DoctorRoutes } from "../modules/Doctor/doctor.routes";
import { PatientRoutes } from "../modules/PatientHealthData/patientHealthData.routes";
import { ScheduleRoutes } from "../modules/Schedule/schedule.routes";
import { DoctorScheduleRoutes } from "../modules/DoctorSchedule/doctorSchedule.routes";

const router = Router();

const allRoutes = [
  {
    path: "/users",
    route: userRoutes,
  },
  {
    path: "/admin",
    route: adminRoutes,
  },
  {
    path: "/auth",
    route: AuthRoutes,
  },
  {
    path: "/specialties",
    route: SpecialtiesRoutes,
  },
  {
    path: "/doctor",
    route: DoctorRoutes,
  },
  {
    path: "/patient",
    route: PatientRoutes,
  },
  {
    path: "/schedule",
    route: ScheduleRoutes,
  },
  {
    path: "/doctor-schedule",
    route: DoctorScheduleRoutes,
  },
];

allRoutes.forEach((item) => {
  router.use(item.path, item.route);
});

export default router;
