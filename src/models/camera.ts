import prisma from '../utils/prisma';

export const getCameras = async () => {
  return prisma.camera.findMany();
};

export const getCameraById = async (id: number) => {
  return prisma.camera.findUnique({ where: { id } });
}; 