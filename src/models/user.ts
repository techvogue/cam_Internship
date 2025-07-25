import prisma from '../utils/prisma';

export interface CreateUserData {
  name: string;
  email: string;
  password: string;
}

export const createUser = async (data: CreateUserData) => {
  return prisma.user.create({
    data,
  });
};

export const getUserByEmail = async (email: string) => {
  return prisma.user.findUnique({
    where: { email },
  });
};

export const getUserById = async (id: number) => {
  return prisma.user.findUnique({
    where: { id },
  });
};
