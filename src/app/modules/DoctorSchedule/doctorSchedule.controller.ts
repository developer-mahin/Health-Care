import { Request, Response } from "express";
import httpStatus from "http-status";
import { TAuthUser } from "../../interface";
import { IAuthUser } from "../../interface/common";
import catchAsync from "../../utils/catchAsync";
import pick from "../../utils/pick";
import { sendResponse } from "../../utils/sendResponse";
import { DoctorScheduleService } from "./doctorSchedule.service";
import { scheduleFilterableFields } from "./doctorSchedule.constant";

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

const getAllFromDB = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, scheduleFilterableFields);
  const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);
  const result = await DoctorScheduleService.getAllFromDB(filters, options);
  sendResponse(res, {
    status: httpStatus.OK,
    success: true,
    message: "Doctor Schedule retrieval successfully",
    meta: result.meta,
    data: result.data,
  });
});

const deleteDoctorSchedule = catchAsync(
  async (req: Request & { user?: TAuthUser }, res: Response) => {
    const user = req.user;
    const { id } = req.params;
    await DoctorScheduleService.deleteDoctorScheduleFromDB(
      user as TAuthUser,
      id
    );

    sendResponse(res, {
      status: httpStatus.OK,
      success: true,
      message: "Delete Doctor Schedule",
    });
  }
);

export const DoctorScheduleController = {
  createDoctorSchedule,
  getDoctorsSchedule,
  deleteDoctorSchedule,
  getAllFromDB,
};
