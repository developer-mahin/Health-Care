import { UserRole } from "@prisma/client";

export type TTokenDecodedUser = {
  email: string;
  role: string;
  iat: number;
  exp: number;
};

export type TAuthUser = {
  id: string;
  email: string;
  role: UserRole;
  iat: number;
  exp: number;
} | null;
