import jwt from "jsonwebtoken";

export const verifyToken = (token: string, secret: string) => {
  return jwt.verify(token, secret);
};
