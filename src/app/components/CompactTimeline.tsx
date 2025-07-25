import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import { format, parseISO, differenceInHours, isToday, isYesterday } from 'date-fns';
import { Incident } from '@/types';
import TypeIcon from './TypeIcon';

interface CompactTimelineProps {
  incidents: Incident[];
  onSelectIncident: (incident: Incident) => void;
  selectedIncident: Incident | null;
  maxItems?: number;
}

export default function CompactTimeline({ 
  incidents, 
  onSelectIncident, 
  selectedIncident, 
  maxItems = 10 
}: CompactTimelineProps) {
  const [showAll, setShowAll] = useState(false);

  // Sort incidents by most recent first and limit display
  const sortedIncidents = useMemo(() => {
    const sorted = [...incidents].sort((a, b) => 
      parseISO(b.tsStart).getTime() - parseISO(a.tsStart).getTime()
    );
    return showAll ? sorted : sorted.slice(0, maxItems);
  }, [incidents, showAll, maxItems]);

  const getTimeAgo = (timestamp: string): string => {
    const date = parseISO(timestamp);
    const now = new Date();
    const hoursAgo = differenceInHours(now, date);

    if (isToday(date)) {
      if (hoursAgo < 1) return 'Just now';
      if (hoursAgo === 1) return '1 hour ago';
      return `${hoursAgo} hours ago`;
    }
    
    if (isYesterday(date)) return 'Yesterday';
    
    return format(date, 'MMM d');
  };

  const getSeverityColor = (type: string): string => {
    switch (type) {
      case 'Gun Threat':
        return 'bg-red-500';
      case 'Unauthorized Access':
        return 'bg-orange-500';
      case 'Suspicious Behavior':
        return 'bg-yellow-500';
      case 'Face Recognised':
        return 'bg-blue-500';
      case 'Traffic congestion':
        return 'bg-gray-500';
      default:
        return 'bg-gray-500';
    }
  };

  if (!incidents.length) {
    return (
      <div className="bg-[#18191A] rounded-lg p-4 text-center text-gray-400">
        <h3 className="font-medium mb-2">Recent Activity</h3>
        <p className="text-sm">No recent incidents</p>
      </div>
    );
  }

  return (
    <div className="bg-[#18191A] rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium text-white">Recent Activity</h3>
        {incidents.length > maxItems && (
          <button
            onClick={() => setShowAll(!showAll)}
            className="text-sm text-blue-400 hover:text-blue-300"
          >
            {showAll ? 'Show Less' : `View All (${incidents.length})`}
          </button>
        )}
      </div>

      <div className="space-y-2">
        {sortedIncidents.map((incident) => (
          <div
            key={incident.id}
            className={`flex items-center gap-3 p-2 rounded cursor-pointer transition-all duration-200 ${
              selectedIncident?.id === incident.id
                ? 'bg-[#1E2A3A] border-l-2 border-blue-500'
                : 'hover:bg-[#252729]'
            }`}
            onClick={() => onSelectIncident(incident)}
          >
            {/* Status dot */}
            <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
              incident.resolved ? 'bg-green-500' : getSeverityColor(incident.type)
            }`}></div>

            {/* Incident icon and thumbnail */}
            <div className="relative w-8 h-8 rounded overflow-hidden bg-gray-700 flex-shrink-0">
              <Image 
                src={incident.thumbnailUrl} 
                alt={`${incident.type} thumbnail`}
                layout='fill'
                objectFit='cover'
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <TypeIcon type={incident.type} />
              </div>
            </div>

            {/* Incident details */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-medium text-white truncate">
                  {incident.type}
                </span>
                {incident.resolved && (
                  <span className="text-xs bg-green-600 text-white px-1.5 py-0.5 rounded-full">
                    ✓
                  </span>
                )}
              </div>
              <div className="text-xs text-gray-400 truncate">
                {incident.camera.name}
              </div>
            </div>

            {/* Time ago */}
            <div className="text-xs text-gray-500 flex-shrink-0">
              {getTimeAgo(incident.tsStart)}
            </div>
          </div>
        ))}
      </div>

      {/* Quick stats */}
      <div className="mt-4 pt-3 border-t border-gray-700">
        <div className="flex justify-between text-xs text-gray-400">
          <span>Total: <span className="text-white">{incidents.length}</span></span>
          <span>Unresolved: <span className="text-red-400">{incidents.filter(i => !i.resolved).length}</span></span>
          <span>Resolved: <span className="text-green-400">{incidents.filter(i => i.resolved).length}</span></span>
        </div>
      </div>
    </div>
  );
}
