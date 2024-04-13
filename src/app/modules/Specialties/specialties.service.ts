import { Request } from "express";
import { IFile } from "../../interface/file";
import { fileUpload } from "../../Middlewares/fileUpload";
import prisma from "../../utils/prisma";
import { Specialties } from "@prisma/client";

const inserIntoDB = async (req: Request) => {
  const file = req.file as IFile;

  if (file) {
    const uploadToCloudinary = await fileUpload.uploadIntoCloudinary(file);
    req.body.icon = uploadToCloudinary?.secure_url;
  }

  const result = await prisma.specialties.create({
    data: req.body,
  });

  return result;
};

const getAllFromDB = async (): Promise<Specialties[]> => {
  return await prisma.specialties.findMany();
};

const deleteFromDB = async (id: string): Promise<Specialties> => {
  const result = await prisma.specialties.delete({
    where: {
      id,
    },
  });
  return result;
};

export const SpecialtiesService = {
  inserIntoDB,
  getAllFromDB,
  deleteFromDB,
};
