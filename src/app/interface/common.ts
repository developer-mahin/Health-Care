import { ENUM_USER_ROLE } from "../../enums";
import { TGenericErrorMessage } from "./error";

export type TGenericResponse<T> = {
  meta: {
    page: number;
    limit: number;
    total: number;
  };
  data: T;
};

export type IGenericErrorResponse = {
  statusCode: number;
  message: string;
  errorMessages: TGenericErrorMessage[];
};

export type IAuthUser = {
  userId: string;
  role: ENUM_USER_ROLE;
  email: string;
} | null;
