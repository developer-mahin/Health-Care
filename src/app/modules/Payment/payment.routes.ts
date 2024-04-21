import { Router } from "express";
import { paymentControllers } from "./payment.controller";

const router = Router();

router.get("/ipn", paymentControllers.validatePayment)

router.post("/init-payment/:id", paymentControllers.initPayment);

export const PaymentRoutes = router;
