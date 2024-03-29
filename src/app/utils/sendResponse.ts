import { Response } from "express";

type TMeta = {
  page: number;
  limit: number;
  total: number;
};

type TSendResponse<T> = {
  status: number;
  success: boolean;
  message: string;
  meta?: TMeta;
  data?: T | null | undefined;
};

export const sendResponse = <T>(res: Response, data: TSendResponse<T>) => {
  res.status(data?.status).json({
    success: data.success,
    message: data.message,
    meta: data.meta,
    data: data.data,
  });
};
