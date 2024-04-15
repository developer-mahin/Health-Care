import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";
import { ScheduleService } from "./schedule.service";

const createSchedule = catchAsync(async (req: Request, res: Response) => {
  const result = await ScheduleService.createScheduleIntoDB(req.body);

  sendResponse(res, {
    status: httpStatus.OK,
    success: true,
    message: "Patient updated successfully",
    data: result,
  });
});

export const ScheduleController = {
  createSchedule,
};
