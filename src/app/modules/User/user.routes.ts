import { UserRole } from "@prisma/client";
import { NextFunction, Request, Response, Router } from "express";
import auth from "../../Middlewares/auth";
import { fileUpload } from "../../Middlewares/fileUpload";
import { userControllers } from "./user.controller";
import { userValidation } from "./user.validation";

const router = Router();

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

  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  fileUpload.upload.single("file"),

  (req: Request, res: Response, next: NextFunction) => {}
);

export const userRoutes = router;
