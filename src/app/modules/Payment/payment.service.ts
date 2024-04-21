import axios from "axios";
import prisma from "../../utils/prisma";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";
import { PaymentStatus } from "@prisma/client";
import { sslService } from "../SSL/ssl.service";


const initPayment = async (appointmentId: string) => {
  const paymentData = await prisma.payment.findFirst({
    where: {
      appointmentId,
    },
    include: {
      appointment: {
        include: {
          patient: true,
        },
      },
    },
  });

  if (!paymentData) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Payment information not found!"
    );
  }
  if (paymentData.status === PaymentStatus.PAID) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "You already pay for the appointment!"
    );
  }

  const paymentSession = await sslService.paymentGateway({
    amount: paymentData.amount,
    transactionId: paymentData.transactionId,
    customerName: paymentData.appointment.patient.name,
    customerEmail: paymentData.appointment.patient.email,
  });

  return {
    url: paymentSession.GatewayPageURL,
  };
};

const validatePayment = async (payload: any) => {
  if (!payload && !payload.status && !(payload.status === "VALID")) {
    throw new AppError(httpStatus.BAD_REQUEST, "Payment Validation Error!!!");
  }

  const response = await sslService.validatePayment(payload);

  if (response.status !== "VALID") {
    throw new AppError(httpStatus.BAD_REQUEST, "Payment Validation Error!");
  }

  // const response = payload;

  await prisma.$transaction(async (tx) => {
    const updatedPaymentData = await tx.payment.update({
      where: {
        transactionId: response.tran_id,
      },
      data: {
        status: PaymentStatus.PAID,
        paymentGatewayData: response,
      },
    });

    await tx.appointment.update({
      where: {
        id: updatedPaymentData.appointmentId,
      },
      data: {
        paymentStatus: PaymentStatus.PAID,
      },
    });
  });

  return {
    message: "Payment Successful",
  };
};

export const PaymentServices = {
  initPayment,
  validatePayment,
};
