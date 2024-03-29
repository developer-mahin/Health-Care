import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import pick from "../../utils/pick";
import { sendResponse } from "../../utils/sendResponse";
import { filterQuery, paginateQuery } from "./admin.constant";
import { adminServices } from "./admin.service";

const getAllAdmins = catchAsync(async (req, res) => {
  const filterData = pick(req?.query, filterQuery);
  const options = pick(req.query, paginateQuery);

  const result = await adminServices.getAllAdminFromDB(filterData, options);

  sendResponse(res, {
    status: httpStatus.OK,
    success: true,
    message: "All admin retrieved successful",
    meta: result.meta,
    data: result.result,
  });
});

const getSingleAdmin = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await adminServices.getSingleAdminFromDB(id);

  sendResponse(res, {
    status: httpStatus.OK,
    success: true,
    message: "A single admin retrieved successful",
    data: result,
  });
});

const updateAdmin = catchAsync(async (req, res) => {
  const { id } = req.params; 
  const result = await adminServices.updateAdminIntoDB(id, req.body);

  sendResponse(res, {
    status: httpStatus.OK,
    success: true,
    message: "An Admin update successful",
    data: result,
  });
});

const deleteAdmin = catchAsync(async (req, res) => {
  const { id } = req.params;
  await adminServices.deleteAdminAdminFromDB(id);

  sendResponse(res, {
    status: httpStatus.OK,
    success: true,
    message: "An admin was deleted successful",
  });
});

const softDeleteAdmin = catchAsync(async (req, res) => {
  const { id } = req.params;
  await adminServices.deleteAdminAdminFromDB(id);

  sendResponse(res, {
    status: httpStatus.OK,
    success: true,
    message: "An admin was deleted successful",
  });
});

export const adminControllers = {
  getAllAdmins,
  getSingleAdmin,
  updateAdmin,
  deleteAdmin,
  softDeleteAdmin,
};
