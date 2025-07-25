import prisma from '../utils/prisma';

export const getIncidents = async (resolved?: boolean) => {
  return prisma.incident.findMany({
    where: typeof resolved === 'boolean' ? { resolved } : undefined,
    orderBy: { tsStart: 'desc' },
    include: { camera: true },
  });
};

export const getIncidentById = async (id: number) => {
  return prisma.incident.findUnique({
    where: { id },
    include: { camera: true },
  });
};

export const resolveIncident = async (id: number) => {
  const incident = await prisma.incident.findUnique({ where: { id } });
  if (!incident) throw new Error('Incident not found');
  if (incident.resolved) throw new Error('Incident already resolved');
  
  return prisma.incident.update({
    where: { id },
    data: { resolved: true },
    include: { camera: true },
  });
};
