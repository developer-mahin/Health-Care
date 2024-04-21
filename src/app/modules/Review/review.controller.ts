import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { IAuthUser } from "../../interface/common";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";
import pick from "../../utils/pick";
import { reviewFilterableFields } from "./review.constant";
import { ReviewService } from "./review.service";

const insertIntoDB = catchAsync(
  async (req: Request & { user?: IAuthUser }, res: Response) => {
    const user = req.user;
    const result = await ReviewService.insertIntoDB(
      req.body,
      user as IAuthUser
    );
    sendResponse(res, {
      status: httpStatus.OK,
      success: true,
      message: "Review created successfully",
      data: result,
    });
  }
);

const getAllFromDB = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, reviewFilterableFields);
  const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);
  const result = await ReviewService.getAllFromDB(filters, options);
  sendResponse(res, {
    status: httpStatus.OK,
    success: true,
    message: "Reviews retrieval successfully",
    meta: result.meta,
    data: result.data,
  });
});

export const ReviewController = {
  insertIntoDB,
  getAllFromDB,
};
