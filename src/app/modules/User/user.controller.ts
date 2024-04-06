import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { userServices } from "./user.service";
import { NextFunction, Request, Response } from "express";
import pick from "../../utils/pick";
import { userFilterableFields } from "./user.constant";
import { TAuthUser } from "../../interface";

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

const createPatient = catchAsync(async (req: Request, res: Response) => {
  const result = await userServices.createPatientIntoDB(req);

  sendResponse(res, {
    status: httpStatus.CREATED,
    success: true,
    message: "successfully patient created",
    data: result,
  });
});

const getAllFromDB = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, userFilterableFields);
  const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);

  const result = await userServices.getAllFromDB(filters, options);

  sendResponse(res, {
    status: httpStatus.OK,
    success: true,
    message: "Users data fetched!",
    meta: result.meta,
    data: result.data,
  });
});

const updateMyProfile = catchAsync(
  async (req: Request & { user?: TAuthUser }, res: Response) => {
    const user = req.user;

    const result = await userServices.updateMyProfileIntoDB(
      user as TAuthUser,
      req
    );

    sendResponse(res, {
      status: httpStatus.OK,
      success: true,
      message: "My profile updated!",
      data: result,
    });
  }
);

const getMyProfile = catchAsync(
  async (req: Request & { user?: TAuthUser }, res: Response) => {
    const user = req.user;
    const result = await userServices.getMyProfileFromDB(user as TAuthUser);

    sendResponse(res, {
      status: httpStatus.OK,
      success: true,
      message: "My profile Fetched successful!",
      data: result,
    });
  }
);

export const userControllers = {
  createAdmin,
  createDoctor,
  createPatient,
  getAllFromDB,
  updateMyProfile,
  getMyProfile,
};
