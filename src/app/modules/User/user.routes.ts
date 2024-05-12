import { UserRole } from "@prisma/client";
import { NextFunction, Request, Response, Router } from "express";
import auth from "../../Middlewares/auth";
import { fileUpload } from "../../Middlewares/fileUpload";
import { userControllers } from "./user.controller";
import { userValidation } from "./user.validation";
import validateRequest from "../../Middlewares/validateRequest";

const router = Router();

router.get(
  "/",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  userControllers.getAllFromDB
);

router.post(
  "/create-admin",

  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  fileUpload.upload.single("file"),

  (req: Request, res: Response, next: NextFunction) => {
    req.body = userValidation.createAdmin.parse(JSON.parse(req.body.data));
    return userControllers.createAdmin(req, res, next);
  }
);

router.post(
  "/create-doctor",

  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  fileUpload.upload.single("file"),

  (req: Request, res: Response, next: NextFunction) => {
    req.body = userValidation.createDoctor.parse(JSON.parse(req.body.data));
    return userControllers.createDoctor(req, res, next);
  }
);

router.post(
  "/create-patient",
  fileUpload.upload.single("file"),

  (req: Request, res: Response, next: NextFunction) => {
    req.body = userValidation.createPatient.parse(JSON.parse(req.body.data));
    return userControllers.createPatient(req, res, next);
  }
);

router.get(
  "/me",
  auth(
    UserRole.SUPER_ADMIN,
    UserRole.ADMIN,
    UserRole.DOCTORS,
    UserRole.PATIENT
  ),
  userControllers.getMyProfile
);

router.patch(
  "/update-my-profile",
  auth(
    UserRole.SUPER_ADMIN,
    UserRole.ADMIN,
    UserRole.DOCTORS,
    UserRole.PATIENT
  ),
  fileUpload.upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    return userControllers.updateMyProfile(req, res, next);
  }
);

export const userRoutes = router;
