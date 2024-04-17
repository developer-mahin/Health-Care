import { Request, Response } from "express";
import httpStatus from "http-status";
import { TAuthUser } from "../../interface";
import { IAuthUser } from "../../interface/common";
import catchAsync from "../../utils/catchAsync";
import pick from "../../utils/pick";
import { sendResponse } from "../../utils/sendResponse";
import { scheduleFilterableFields } from "../Schedule/schedule.constant";
import { DoctorScheduleService } from "./doctorSchedule.service";

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

const getDoctorsSchedule = catchAsync(
  async (req: Request & { user?: TAuthUser }, res: Response) => {
    const filters = pick(req.query, [
      "startDateTime",
      "endDateTime",
      "isBooked",
    ]);
    const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);
    const user = req.user;
    const result = await DoctorScheduleService.getDoctorScheduleFromDB(
      filters,
      options,
      user as IAuthUser
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

export const DoctorScheduleController = {
  createDoctorSchedule,
  getDoctorsSchedule,
};
