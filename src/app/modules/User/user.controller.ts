import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { userServices } from "./user.service";
import { NextFunction, Request, Response } from "express";

const createAdmin = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await userServices.createAdminIntoDB(req);

    console.log(req.body);

    sendResponse(res, {
      status: httpStatus.CREATED,
      success: true,
      message: "successfully admin created",
      data: result,
    });
  }
);

const createDoctor = catchAsync(async (req: Request, res: Response) => {
  const result = await userServices.createDoctorIntoDB(req);

  sendResponse(res, {
    status: httpStatus.CREATED,
    success: true,
    message: "successfully doctor created",
    data: result,
  });
});

export const userControllers = {
  createAdmin,
  createDoctor,
};
