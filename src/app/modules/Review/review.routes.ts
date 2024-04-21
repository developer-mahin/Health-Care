import { Router } from "express";
import { ReviewController } from "./review.controller";
import auth from "../../Middlewares/auth";
import { ENUM_USER_ROLE } from "../../../enums";
import validateRequest from "../../Middlewares/validateRequest";
import { ReviewValidation } from "./review.validation";

const router = Router();
router.get("/", ReviewController.getAllFromDB);

router.post(
  "/",
  auth(ENUM_USER_ROLE.PATIENT),
  validateRequest(ReviewValidation.create),
  ReviewController.insertIntoDB
);

export const ReviewRoutes = router;
