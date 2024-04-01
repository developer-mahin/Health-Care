import { NextFunction, Request, Response, Router } from "express";
import { userControllers } from "./user.controller";
import auth from "../../Middlewares/auth";
import { UserRole } from "@prisma/client";
import { fileUpload } from "../../Middlewares/fileUpload";

const router = Router();

router.post(
  "/create-admin",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  fileUpload.upload.single("file"),

  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    next();
  },

  userControllers.createAdmin
);

export const userRoutes = router;
