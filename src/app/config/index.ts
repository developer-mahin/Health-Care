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
  reset_pass_secret: process.env.RESET_PASS_SECRET,
  reset_pass_expires_in: process.env.RESET_PASS_EXPIRES_IN,
  front_end_url: process.env.FRONT_END_URL,
  smtp_email: process.env.SMTP_EMAIL,
  smtp_pass: process.env.SMTP_PASS,
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
};
