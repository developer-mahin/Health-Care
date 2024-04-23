import { UserRole } from "@prisma/client";
import prisma from "../src/app/utils/prisma";
import config from "../src/app/config";
import bcrypt from "bcryptjs";

const seedSuperAdmin = async () => {
  try {
    const isExistSuperAdmin = await prisma.user.findFirst({
      where: {
        role: UserRole.SUPER_ADMIN,
      },
    });

    if (isExistSuperAdmin) {
      console.log("Super Admin is already exist!!");
      return;
    }

    const hashPassword = await bcrypt.hash(config.super_admin.password!, 10);

    const createSuperAdmin = await prisma.user.create({
      data: {
        email: config.super_admin.email!,
        password: hashPassword,
        role: UserRole.SUPER_ADMIN,
        admin: {
          create: {
            name: config.super_admin.name!,
            contactNumber: config.super_admin.contactNumber!,
          },
        },
      },
    });

    console.log("super admin created successfully!", createSuperAdmin);
  } catch (error) {
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
};

seedSuperAdmin();
