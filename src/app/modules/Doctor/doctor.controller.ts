import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { DoctorService } from "./doctor.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";
import pick from "../../utils/pick";
import { doctorFilterableFields } from "./doctor.constant";

const getAllFromDB = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, doctorFilterableFields);
  const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);
  const result = await DoctorService.getAllFromDB(filters, options);
  sendResponse(res, {
    status: httpStatus.OK,
    success: true,
    message: "Doctors retrieval successfully",
    meta: result.meta,
    data: result.data,
  });
});

const getByIdFromDB = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await DoctorService.getByIdFromDB(id);
  sendResponse(res, {
    status: httpStatus.OK,
    success: true,
    message: "Doctor retrieval successfully",
    data: result,
  });
});

const updateIntoDB = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const payload = req.body;
  const { ...doctorData } = payload;
  const result = await DoctorService.updateIntoDB(id, doctorData);
  sendResponse(res, {
    status: httpStatus.OK,
    success: true,
    message: "Doctor updated successfully",
    data: result,
  });
});

const deleteFromDB = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await DoctorService.deleteFromDB(id);
  sendResponse(res, {
    status: httpStatus.OK,
    success: true,
    message: "Doctor deleted successfully",
    data: result,
  });
});

const softDelete = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await DoctorService.softDelete(id);
  sendResponse(res, {
    status: httpStatus.OK,
    success: true,
    message: "Doctor soft deleted successfully",
    data: result,
  });
});

export const DoctorController = {
  getAllFromDB,
  getByIdFromDB,
  updateIntoDB,
  deleteFromDB,
  softDelete,
};
