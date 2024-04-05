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

export const userValidation = {
  createAdmin,
  createDoctor,
};
