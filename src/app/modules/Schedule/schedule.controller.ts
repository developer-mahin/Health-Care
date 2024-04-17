import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";
import { ScheduleService } from "./schedule.service";
import pick from "../../utils/pick";
import { TAuthUser } from "../../interface";
import { scheduleFilterableFields } from "./schedule.constant";

const createSchedule = catchAsync(async (req: Request, res: Response) => {
  const result = await ScheduleService.createScheduleIntoDB(req.body);

  sendResponse(res, {
    status: httpStatus.OK,
    success: true,
    message: "Patient updated successfully",
    data: result,
  });
});

const getAllFromDB = catchAsync(
  async (req: Request & { user?: TAuthUser }, res: Response) => {
    const filters = pick(req.query, scheduleFilterableFields);
    const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);
    const user = req.user;
    const result = await ScheduleService.getAllScheduleFromDB(
      filters,
      options,
      user
    );
    sendResponse(res, {
      status: httpStatus.OK,
      success: true,
      message: "Schedule retrieval successfully",
      meta: result.meta,
      data: result.data,
    });
  }
);

export const ScheduleController = {
  createSchedule,
  getAllFromDB,
};
