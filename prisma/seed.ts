import { UserRole } from "@prisma/client";
import prisma from "../src/app/utils/prisma";
import config from "../src/app/config";

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

    const createSuperAdmin = await prisma.user.create({
      data: {
        email: config.super_admin.email!,
        password: config.super_admin.password!,
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
