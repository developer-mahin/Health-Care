import { NextFunction, Request, Response } from "express";
import { userServices } from "./user.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";

const createAdmin = async (req: Request, res: Response, next: NextFunction) => {
  const result = await userServices.createAdminIntoDB(req.body);
  sendResponse(res, {
    status: httpStatus.CREATED,
    success: true,
    message: "successfully admin created ",
    data: result,
  });
};

export const userControllers = {
  createAdmin,
};
