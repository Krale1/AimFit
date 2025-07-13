import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export async function registerUser(data: {
  name: string;
  surname: string;
  email: string;
  password: string;
}) {
  const existing = await prisma.user.findUnique({ where: { email: data.email } });
  if (existing) throw new Error('User already exists');

  const hashedPassword = await bcrypt.hash(data.password, 10);
  const user = await prisma.user.create({
    data: {
      name: data.name,
      surname: data.surname,
      email: data.email,
      password: hashedPassword,
      unitPreference: {
        create: {} 
      }
    }
  });

  return user;
}