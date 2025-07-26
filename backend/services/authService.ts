import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

const prisma = new PrismaClient();

export async function getAllUsers() {
  return await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      surname: true,
      email: true,
      createdAt: true,
      emailVerified: true,
    },
  });
}

export async function registerUser(data: {
  name: string;
  surname: string;
  email: string;
  password: string;
  emailVerified?: boolean;
}) {
  const existing = await prisma.user.findUnique({ where: { email: data.email } });
  if (existing) throw new Error("User already exists");

  const hashedPassword = data.password ? await bcrypt.hash(data.password, 10) : "";

  const user = await prisma.user.create({
    data: {
      name: data.name,
      surname: data.surname,
      email: data.email,
      password: hashedPassword,
      emailVerified: data.emailVerified || false, // ✅ Manual users false, Google true
      unitPreference: { create: {} },
    },
  });

  return user;
}


export async function findUserByEmail(email: string) {
  return await prisma.user.findUnique({ where: { email } });
}

export async function createVerificationToken(userId: string) {
  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 20 * 60 * 1000); // 20 minutes
  await prisma.emailVerificationToken.create({
    data: {
      token,
      userId,
      expiresAt,
    },
  });
  return { token, expiresAt };
}

export async function verifyEmailToken(token: string) {
  console.log("Verifying token:", token);
  const record = await prisma.emailVerificationToken.findUnique({ where: { token } });
  console.log("Found token record:", record);

  if (!record) {
    console.log("Token not found in DB");
    return null;
  }

  if (record.expiresAt < new Date()) {
    console.log("Token expired at:", record.expiresAt);
    return null;
  }

  // Update user and delete token
  await prisma.user.update({
    where: { id: record.userId },
    data: { emailVerified: true },
  });

  await prisma.emailVerificationToken.delete({ where: { token } });

  return await prisma.user.findUnique({ where: { id: record.userId } });
}
