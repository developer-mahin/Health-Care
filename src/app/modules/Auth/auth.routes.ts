import { Router } from "express";
import { AuthController } from "./auth.controller";

const router = Router();

router.post("/login", AuthController.loginUser);
router.post("/refresh-token", AuthController.refreshToken);

export const AuthRoutes = router;
