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
  ssl: {
    store_id: process.env.STORE_ID,
    store_passwd: process.env.STORE_PASSWD,
    success_url: process.env.SUCCESS_URL,
    cancel_url: process.env.CANCEL_URL,
    fail_url: process.env.FAIL_URL,
    ipn_url: process.env.IPN_URL,
    ssl_payment_api: process.env.SSL_PAYMENT_API,
    ssl_validation_api: process.env.SSL_VALIDATION_API,
  },
};
