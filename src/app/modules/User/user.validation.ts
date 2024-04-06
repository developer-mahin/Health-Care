import { UserStatus } from "@prisma/client";
import { z } from "zod";

const createAdmin = z.object({
  password: z.string({
    required_error: "Password is required",
  }),
  admin: z.object({
    name: z.string({
      required_error: "Name is required!",
    }),
    email: z.string({
      required_error: "Email is required!",
    }),
    contactNumber: z.string({
      required_error: "Contact Number is required!",
    }),
  }),
});

const createDoctor = z.object({
  password: z.string(),
  doctor: z.object({
    email: z.string().email(),
    name: z.string(),
    contactNumber: z.string(),
    address: z.string().nullable(),
    registrationNumber: z.string(),
    experience: z.number().int(),
    gender: z.enum(["MALE", "FEMALE"]),
    appointmentFee: z.number(),
    qualification: z.string(),
    currentWorkingPlace: z.string(),
    designation: z.string(),
  }),
});

const createPatient = z.object({
  password: z.string(),
  patient: z.object({
    name: z.string(),
    email: z.string().email(),
    contactNumber: z.string(),
    address: z.string().nullable(),
  }),
});

const updateStatus = z.object({
  body: z.object({
    status: z.enum([UserStatus.ACTIVE, UserStatus.BLOCKED, UserStatus.DELETED]),
  }),
});

export const userValidation = {
  createAdmin,
  createDoctor,
  createPatient,
  updateStatus,
};
