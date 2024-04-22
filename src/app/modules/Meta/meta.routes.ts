import { Router } from "express";
import { MetaController } from "./meta.controller";
import auth from "../../Middlewares/auth";
import { UserRole } from "@prisma/client";

const router = Router();

router.get(
  "/",
  auth(
    UserRole.SUPER_ADMIN,
    UserRole.ADMIN,
    UserRole.DOCTORS,
    UserRole.PATIENT
  ),
  MetaController.fetchMetaData
);

export const MetaRoutes = router;
