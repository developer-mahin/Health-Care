import { Request, Response } from "express";
import { IAuthUser } from "../../interface/common";
import catchAsync from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { AppointmentServices } from "./appointment.service";
import httpStatus from "http-status";
import pick from "../../utils/pick";
import { appointmentFilterableFields } from "./appointment.constant";

const createAppointment = catchAsync(
  async (req: Request & { user?: IAuthUser }, res: Response) => {
    const user = req.user;
    const result = await AppointmentServices.createAppointmentIntoDB(
      req.body,
      user as IAuthUser
    );
    sendResponse(res, {
      status: httpStatus.OK,
      success: true,
      message: "Appointment booked successfully!",
      data: result,
    });
  }
);

const getMyAppointment = catchAsync(
  async (req: Request & { user?: IAuthUser }, res: Response) => {
    const filters = pick(req.query, appointmentFilterableFields);
    const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);
    const user = req.user;
    const result = await AppointmentServices.getMyAppointment(
      filters,
      options,
      user as IAuthUser
    );
    sendResponse(res, {
      status: httpStatus.OK,
      success: true,
      message: "Appointment retrieval successfully",
      meta: result.meta,
      data: result.data,
    });
  }
);

const getAllFromDB = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, appointmentFilterableFields);
  const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);
  const result = await AppointmentServices.getAllFromDB(filters, options);
  sendResponse(res, {
    status: httpStatus.OK,
    success: true,
    message: "Appointment retrieval successfully",
    meta: result.meta,
    data: result.data,
  });
});

export const AppointmentControllers = {
  createAppointment,
  getMyAppointment,
  getAllFromDB,
};
