import { ENUM_USER_ROLE } from "../../enums";

export type TTokenDecodedUser = {
  email: string;
  role: string;
  iat: number;
  exp: number;
};

export type TAuthUser = {
  id: string;
  email: string;
  role: string;
  iat: number;
  exp: number;
} | null;
