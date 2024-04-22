import { ZodError, ZodIssue } from "zod";
import { IGenericErrorResponse } from "../interface/common";
import { TGenericErrorMessage } from "../interface/error";

const handleZodError = (error: ZodError): IGenericErrorResponse => {
  const errors: TGenericErrorMessage[] = error.issues.map((issue: ZodIssue) => {
    return {
      path: issue?.path[issue.path.length - 1],
      message: issue?.message,
    };
  });

  const statusCode = 400;

  return {
    statusCode,
    message: "Validation Error",
    errorMessages: errors,
  };
};

export default handleZodError;
