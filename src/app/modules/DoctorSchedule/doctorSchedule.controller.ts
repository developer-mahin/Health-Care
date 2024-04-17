import httpStatus from "http-status";
import { TAuthUser } from "../../interface";
import catchAsync from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { DoctorScheduleService } from "./doctorSchedule.service";
import { Request, Response } from "express";

const createDoctorSchedule = catchAsync(
  async (req: Request & { user?: TAuthUser }, res: Response) => {
    const user = req.user;
    const result = await DoctorScheduleService.createDoctorScheduleIntoDB(
      user,
      req.body
    );

    sendResponse(res, {
      status: httpStatus.OK,
      success: true,
      message: "Doctor Schedule Created",
      data: result,
    });
  }
);

export const DoctorScheduleController = {
  createDoctorSchedule,
};
