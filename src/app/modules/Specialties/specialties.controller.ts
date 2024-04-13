import { Request, Response } from "express";
import httpStatus from "http-status";
import { SpecialtiesService } from "./specialties.service";
import catchAsync from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";

const inserIntoDB = catchAsync(async (req: Request, res: Response) => {
  console.log(req.body);
  const result = await SpecialtiesService.inserIntoDB(req);

  sendResponse(res, {
    status: httpStatus.OK,
    success: true,
    message: "Specialties created successfully!",
    data: result,
  });
});

const getAllFromDB = catchAsync(async (req: Request, res: Response) => {
  const result = await SpecialtiesService.getAllFromDB();
  sendResponse(res, {
    status: httpStatus.OK,
    success: true,
    message: "Specialties data fetched successfully",
    data: result,
  });
});

const deleteFromDB = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  await SpecialtiesService.deleteFromDB(id);
  sendResponse(res, {
    status: httpStatus.OK,
    success: true,
    message: "Specialty deleted successfully",
  });
});

export const SpecialtiesController = {
  inserIntoDB,
  getAllFromDB,
  deleteFromDB,
};
