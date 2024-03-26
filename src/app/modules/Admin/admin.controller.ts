import { NextFunction, Request, Response, query } from "express";
import { adminServices } from "./admin.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";
import pick from "../../utils/pick";
import { filterQuery, paginateQuery } from "./admin.constant";

const getAllAdmins = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  
  const filterData = pick(req?.query, filterQuery);
  const options = pick(req.query, paginateQuery);

  const result = await adminServices.getAllAdminFromDB(filterData, options);
  sendResponse(res, {
    status: httpStatus.OK,
    success: true,
    message: "All admin retrieved successful",
    data: result,
  });
};

export const adminControllers = {
  getAllAdmins,
};
