import axios from "axios";
import config from "../../config";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";
import { PaymentInfo } from "./ssl.interface";

const paymentGateway = async (paymentData: PaymentInfo) => {
  try {
    const data = {
      store_id: config.ssl.store_id,
      store_passwd: config.ssl.store_passwd,
      total_amount: paymentData.amount,
      currency: "BDT",
      tran_id: paymentData.transactionId,
      success_url: config.ssl.success_url,
      fail_url: config.ssl.fail_url,
      cancel_url: config.ssl.cancel_url,
      ipn_url: "http://localhost:3000/api/v1/payment/ipn",
      shipping_method: "N/A",
      product_name: "Doctor Appoinment",
      product_category: "Appointment",
      product_profile: "general",
      cus_name: paymentData.customerName,
      cus_email: paymentData.customerEmail,
      cus_add1: "address",
      cus_city: "Dhaka",
      cus_state: "Dhaka",
      cus_postcode: "1000",
      cus_country: "Bangladesh",
      cus_phone: "93843483",
      cus_fax: "01711111111",
      ship_name: "Customer Name",
      ship_add1: "Dhaka",
      ship_add2: "Dhaka",
      ship_city: "Dhaka",
      ship_state: "Dhaka",
      ship_postcode: 1000,
      ship_country: "Bangladesh",
    };
    const response = await axios({
      method: "post",
      url: config.ssl.ssl_payment_api,
      data: data,
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });

    return response.data;
  } catch (error: any) {
    throw new AppError(httpStatus.BAD_REQUEST, error.message);
  }
};

const validatePayment = async (payload: any) => {
  try {
    const response = await axios({
      method: "GET",
      url: `${config.ssl.ssl_validation_api}?val_id=${payload.val_id}&store_id=${config.ssl.store_id}&store_passwd=${config.ssl.store_passwd}&format=json`,
    });

    return response.data;
  } catch (error: any) {
    throw new AppError(httpStatus.BAD_REQUEST, error.message);
  }
};

export const sslService = {
  paymentGateway,
  validatePayment,
};
