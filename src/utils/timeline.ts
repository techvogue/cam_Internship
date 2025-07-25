import { parseISO, format, differenceInDays, differenceInHours, differenceInMinutes, isToday, isYesterday, startOfDay } from 'date-fns';
import { Incident } from '@/types';

export interface TimelineStats {
  total: number;
  resolved: number;
  unresolved: number;
  highSeverity: number;
  mediumSeverity: number;
  lowSeverity: number;
  todayIncidents: number;
  weekIncidents: number;
}

export interface TimelineFilters {
  timeRange: 'today' | 'week' | 'month' | 'all';
  status: 'all' | 'resolved' | 'unresolved';
  severity: 'all' | 'high' | 'medium' | 'low';
  incidentType: string | 'all';
}

export const getIncidentSeverity = (type: string): 'high' | 'medium' | 'low' => {
  switch (type) {
    case 'Gun Threat':
      return 'high';
    case 'Unauthorized Access':
      return 'medium';
    case 'Suspicious Behavior':
      return 'low';
    case 'Face Recognised':
      return 'low';
    case 'Traffic congestion':
      return 'low';
    default:
      return 'low';
  }
};

export const getSeverityColor = (severity: 'high' | 'medium' | 'low'): string => {
  switch (severity) {
    case 'high':
      return 'bg-red-500';
    case 'medium':
      return 'bg-orange-500';
    case 'low':
      return 'bg-yellow-500';
    default:
      return 'bg-gray-500';
  }
};

export const getIncidentTypeColor = (type: string): string => {
  return getSeverityColor(getIncidentSeverity(type));
};

export const calculateTimelineStats = (incidents: Incident[]): TimelineStats => {
  const now = new Date();
  
  const stats: TimelineStats = {
    total: incidents.length,
    resolved: 0,
    unresolved: 0,
    highSeverity: 0,
    mediumSeverity: 0,
    lowSeverity: 0,
    todayIncidents: 0,
    weekIncidents: 0,
  };

  incidents.forEach(incident => {
    const incidentDate = parseISO(incident.tsStart);
    const daysDiff = differenceInDays(now, incidentDate);
    
    // Resolution status
    if (incident.resolved) {
      stats.resolved++;
    } else {
      stats.unresolved++;
    }

    // Severity
    const severity = getIncidentSeverity(incident.type);
    switch (severity) {
      case 'high':
        stats.highSeverity++;
        break;
      case 'medium':
        stats.mediumSeverity++;
        break;
      case 'low':
        stats.lowSeverity++;
        break;
    }

    // Time-based counts
    if (isToday(incidentDate)) {
      stats.todayIncidents++;
    }
    if (daysDiff < 7) {
      stats.weekIncidents++;
    }
  });

  return stats;
};

export const filterIncidents = (incidents: Incident[], filters: TimelineFilters): Incident[] => {
  let filtered = [...incidents];
  const now = new Date();

  // Time range filter
  if (filters.timeRange !== 'all') {
    const cutoffDays = filters.timeRange === 'today' ? 1 : 
                      filters.timeRange === 'week' ? 7 : 30;
    
    filtered = filtered.filter(incident => {
      const incidentDate = parseISO(incident.tsStart);
      return differenceInDays(now, incidentDate) < cutoffDays;
    });
  }

  // Status filter
  if (filters.status !== 'all') {
    filtered = filtered.filter(incident => 
      filters.status === 'resolved' ? incident.resolved : !incident.resolved
    );
  }

  // Severity filter
  if (filters.severity !== 'all') {
    filtered = filtered.filter(incident => 
      getIncidentSeverity(incident.type) === filters.severity
    );
  }

  // Incident type filter
  if (filters.incidentType !== 'all') {
    filtered = filtered.filter(incident => incident.type === filters.incidentType);
  }

  return filtered;
};

export const getTimeAgo = (timestamp: string): string => {
  const date = parseISO(timestamp);
  const now = new Date();
  
  const minutesAgo = differenceInMinutes(now, date);
  const hoursAgo = differenceInHours(now, date);
  const daysAgo = differenceInDays(now, date);

  if (minutesAgo < 1) return 'Just now';
  if (minutesAgo < 60) return `${minutesAgo}m ago`;
  
  if (isToday(date)) {
    return `${hoursAgo}h ago`;
  }
  
  if (isYesterday(date)) return 'Yesterday';
  
  if (daysAgo < 7) return `${daysAgo} days ago`;
  
  return format(date, 'MMM d');
};

export const formatIncidentDuration = (incident: Incident): string => {
  const start = parseISO(incident.tsStart);
  const end = parseISO(incident.tsEnd);
  const durationMs = end.getTime() - start.getTime();
  const durationMinutes = Math.floor(durationMs / (1000 * 60));
  const durationSeconds = Math.floor((durationMs % (1000 * 60)) / 1000);
  
  if (durationMinutes > 0) {
    return `${durationMinutes}m ${durationSeconds}s`;
  }
  return `${durationSeconds}s`;
};

export const formatIncidentTime = (incident: Incident): string => {
  const start = parseISO(incident.tsStart);
  const end = parseISO(incident.tsEnd);
  
  return `${format(start, 'h:mm a')} - ${format(end, 'h:mm a')}`;
};

export const getDateLabel = (date: Date): string => {
  if (isToday(date)) return 'Today';
  if (isYesterday(date)) return 'Yesterday';
  return format(date, 'EEEE, MMMM d');
};

export const groupIncidentsByDate = (incidents: Incident[]): { [date: string]: Incident[] } => {
  const groups: { [date: string]: Incident[] } = {};
  
  incidents.forEach(incident => {
    const dateKey = format(parseISO(incident.tsStart), 'yyyy-MM-dd');
    if (!groups[dateKey]) {
      groups[dateKey] = [];
    }
    groups[dateKey].push(incident);
  });

  // Sort incidents within each group
  Object.keys(groups).forEach(dateKey => {
    groups[dateKey].sort((a, b) => 
      parseISO(b.tsStart).getTime() - parseISO(a.tsStart).getTime()
    );
  });

  return groups;
};

export const getUniqueIncidentTypes = (incidents: Incident[]): string[] => {
  const types = new Set(incidents.map(incident => incident.type));
  return Array.from(types).sort();
};

export interface TimelineEvent {
  id: number;
  incident: Incident;
  startTime: Date;
  endTime: Date;
  duration: number;
  position: number;
  width: number;
}

export const generateTimelineEvents = (incidents: Incident[], timelineDate: Date): TimelineEvent[] => {
  const startOfTimeline = startOfDay(timelineDate);
  const dayMs = 24 * 60 * 60 * 1000;
  
  return incidents.map(incident => {
    const startTime = parseISO(incident.tsStart);
    const endTime = parseISO(incident.tsEnd);
    const duration = endTime.getTime() - startTime.getTime();
    
    // Calculate position as percentage of the day
    const position = ((startTime.getTime() - startOfTimeline.getTime()) / dayMs) * 100;
    
    // Calculate width as percentage of the day
    const width = Math.max((duration / dayMs) * 100, 0.5); // Minimum width for visibility
    
    return {
      id: incident.id,
      incident,
      startTime,
      endTime,
      duration,
      position: Math.max(0, Math.min(100, position)),
      width: Math.min(width, 100 - Math.max(0, position))
    };
  }).filter(event => event.position < 100); // Only include events that are visible on this day
};

export const getTimeFromPosition = (position: number, timelineDate: Date): Date => {
  const startOfTimeline = startOfDay(timelineDate);
  const dayMs = 24 * 60 * 60 * 1000;
  return new Date(startOfTimeline.getTime() + (position / 100) * dayMs);
};

export const getPositionFromTime = (time: Date, timelineDate: Date): number => {
  const startOfTimeline = startOfDay(timelineDate);
  const dayMs = 24 * 60 * 60 * 1000;
  return ((time.getTime() - startOfTimeline.getTime()) / dayMs) * 100;
};

export const findNearestIncident = (currentTime: Date, incidents: Incident[], direction: 'next' | 'prev'): Incident | null => {
  const sortedIncidents = incidents.sort((a, b) => 
    parseISO(a.tsStart).getTime() - parseISO(b.tsStart).getTime()
  );
  
  if (direction === 'next') {
    return sortedIncidents.find(incident => 
      parseISO(incident.tsStart).getTime() > currentTime.getTime()
    ) || null;
  } else {
    return [...sortedIncidents].reverse().find(incident => 
      parseISO(incident.tsStart).getTime() < currentTime.getTime()
    ) || null;
  }
};

export const getActiveIncidentAtTime = (time: Date, incidents: Incident[]): Incident | null => {
  return incidents.find(incident => {
    const startTime = parseISO(incident.tsStart);
    const endTime = parseISO(incident.tsEnd);
    return time >= startTime && time <= endTime;
  }) || null;
};

export const generateTimeMarkers = (interval: 'hour' | 'halfHour' | 'quarter' = 'hour'): { hour: number; minutes: number; label: string; position: number; isMainMarker: boolean }[] => {
  const markers = [];
  const step = interval === 'hour' ? 60 : interval === 'halfHour' ? 30 : 15;
  
  for (let minutes = 0; minutes < 24 * 60; minutes += step) {
    const hour = Math.floor(minutes / 60);
    const minute = minutes % 60;
    const isMainMarker = minute === 0;
    
    markers.push({
      hour,
      minutes: minute,
      label: minute === 0 ? 
        `${hour.toString().padStart(2, '0')}:00` : 
        `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`,
      position: (minutes / (24 * 60)) * 100,
      isMainMarker
    });
  }
  
  return markers;
};
