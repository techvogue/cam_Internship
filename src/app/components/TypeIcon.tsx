import React from 'react';
import { IncidentType } from '@/types';

const GunIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
  </svg>
);

const DoorIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 19H5V5h14m0-2H5c-1.11 0-2 .89-2 2v14c0 1.11.89 2 2 2h14c1.11 0 2-.89 2-2V5c0-1.11-.89-2-2-2zm-5.5 6c.83 0 1.5-.67 1.5-1.5S14.33 6 13.5 6 12 6.67 12 7.5 12.67 9 13.5 9z"/>
  </svg>
);

const PersonIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
  </svg>
);

const WarningIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
    <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/>
  </svg>
);

const CarIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>
  </svg>
);

const typeIcons: Record<IncidentType, { icon: React.ReactNode; color: string; bgColor: string }> = {
  'Gun Threat': { icon: <GunIcon />, color: 'text-red-500', bgColor: 'bg-red-500/20' },
  'Unauthorized Access': { icon: <DoorIcon />, color: 'text-orange-500', bgColor: 'bg-orange-500/20' },
  'Face Recognised': { icon: <PersonIcon />, color: 'text-blue-500', bgColor: 'bg-blue-500/20' },
  'Suspicious Behavior': { icon: <WarningIcon />, color: 'text-yellow-400', bgColor: 'bg-yellow-400/20' },
  'Traffic congestion': { icon: <CarIcon />, color: 'text-teal-500', bgColor: 'bg-teal-500/20' },
};

export default function TypeIcon({ type }: { type: string }) {
  const iconData = typeIcons[type as IncidentType];
  
  if (!iconData) {
    return <span className="inline-block w-5 h-5 rounded mr-2 bg-gray-400/20"></span>;
  }
  
  return (
    <span className={`inline-flex items-center justify-center w-5 h-5 mr-2 rounded ${iconData.color} ${iconData.bgColor}`}>
      {iconData.icon}
    </span>
  );
}
