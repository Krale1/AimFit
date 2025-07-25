import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export async function getAllUsers() {
  return await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      surname: true,
      email: true,
      createdAt: true,
    },
  });
}

export async function registerUser(data: {
  name: string;
  surname: string;
  email: string;
  password: string;
}) {
  const existing = await prisma.user.findUnique({ where: { email: data.email } });
  if (existing) throw new Error('User already exists');

  // Hash password if provided, else empty string (for Google users)
  const hashedPassword = data.password ? await bcrypt.hash(data.password, 10) : "";

  const user = await prisma.user.create({
    data: {
      name: data.name,
      surname: data.surname,
      email: data.email,
      password: hashedPassword,
      unitPreference: {
        create: {}, // creates default unitPreference record
      },
    },
  });

  return user;
}

export async function findUserByEmail(email: string) {
  return await prisma.user.findUnique({ where: { email } });
}
