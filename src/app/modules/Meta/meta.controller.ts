import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";
import { IAuthUser } from "../../interface/common";
import { MetaService } from "./meta.service";

const fetchMetaData = catchAsync(
  async (req: Request & { user?: IAuthUser }, res: Response) => {
    const user = req.user;

    const result = await MetaService.fetchMetaData(user as IAuthUser);

    sendResponse(res, {
      status: httpStatus.OK,
      success: true,
      message: "Meta Data Retrieve Successfully",
      data: result,
    });
  }
);

export const MetaController = {
  fetchMetaData,
};
