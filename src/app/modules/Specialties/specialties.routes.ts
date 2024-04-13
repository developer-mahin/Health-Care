import express, { NextFunction, Request, Response } from "express";

import { UserRole } from "@prisma/client";
import { fileUpload } from "../../Middlewares/fileUpload";
import { SpecialtiesController } from "./specialties.controller";
import { SpecialtiesValidtaion } from "./specialties.validation";
import auth from "../../Middlewares/auth";

const router = express.Router();

router.get("/", SpecialtiesController.getAllFromDB);

router.post(
  "/",
  fileUpload.upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = SpecialtiesValidtaion.create.parse(JSON.parse(req.body.data));
    return SpecialtiesController.inserIntoDB(req, res, next);
  }
);

router.delete(
  "/:id",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  SpecialtiesController.deleteFromDB
);

export const SpecialtiesRoutes = router;
