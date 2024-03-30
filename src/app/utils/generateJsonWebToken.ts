import jwt from "jsonwebtoken";

type TJwtPayload = {
  email: string;
  role: string;
};

export const generateJsonWebToken = (
  payload: TJwtPayload,
  secret: string,
  expiresIn: string
) => {
  return jwt.sign(payload, secret, { expiresIn });
};
