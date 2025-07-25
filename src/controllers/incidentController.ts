import { getIncidents, getIncidentById, resolveIncident } from '../models/incident';
import { Incident } from '@/types';

export const fetchIncidents = async (resolved?: boolean): Promise<Incident[]> => {
  const incidents = await getIncidents(resolved);
  return incidents.map(incident => ({
    ...incident,
    tsStart: incident.tsStart.toISOString(),
    tsEnd: incident.tsEnd.toISOString()
  }));
};

export const fetchIncidentById = async (id: number): Promise<Incident | null> => {
  const incident = await getIncidentById(id);
  if (!incident) return null;
  return {
    ...incident,
    tsStart: incident.tsStart.toISOString(),
    tsEnd: incident.tsEnd.toISOString()
  };
};

export const toggleIncidentResolved = async (id: number): Promise<Incident> => {
  const incident = await resolveIncident(id);
  return {
    ...incident,
    tsStart: incident.tsStart.toISOString(),
    tsEnd: incident.tsEnd.toISOString()
  };
};
