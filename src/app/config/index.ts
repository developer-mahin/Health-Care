import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

export default {
  NODE_ENV: process.env.NODE_ENV,
  PORT: process.env.PORT,
  defaultPassword: process.env.DEFAULT_PASSWORD,
  access_secret: process.env.JWT_ACCESS_SECRET,
  access_expires_in: process.env.JWT_ACCESS_EXPIRES_IN,
  refresh_secret: process.env.JWT_REFRESH_SECRET,
  refresh_expires_in: process.env.JWT_REFRESH_EXPIRES_IN,
};
