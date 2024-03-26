import { Response } from "express";

type TSendResponse<T> = {
  status: number;
  success: boolean;
  message: string;
  data: any;
};

export const sendResponse = <T>(res: Response, data: TSendResponse<T>) => {
  res.status(data?.status).json({
    success: data.success,
    message: data.message,
    data: data.data,
  });
};
