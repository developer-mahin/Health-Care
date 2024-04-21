import { Request, Response } from "express";
import httpStatus from "http-status";
import { PaymentServices } from "./payment.service";
import catchAsync from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";

const initPayment = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await PaymentServices.initPayment(id);

  sendResponse(res, {
    status: httpStatus.OK,
    success: true,
    message: "Payment initiate successfully",
    data: result,
  });
});

const validatePayment = catchAsync(async (req: Request, res: Response) => {

  const result = await PaymentServices.validatePayment(req.query);

  sendResponse(res, {
    status: httpStatus.OK,
    success: true,
    message: "Payment initiate successfully",
    data: result,
  });
});

export const paymentControllers = {
  initPayment,
  validatePayment
};
