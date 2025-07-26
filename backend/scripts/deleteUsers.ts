import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function deleteUsers() {
  try {
    await prisma.user.deleteMany({});
    console.log("All users deleted successfully.");
  } catch (error) {
    console.error("Failed to delete users:", error);
  } finally {
    await prisma.$disconnect();
  }
}

deleteUsers();
