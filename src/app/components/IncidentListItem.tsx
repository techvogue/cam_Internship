import React from 'react';
import Image from 'next/image';
import TypeIcon from './TypeIcon';
import { Incident } from '@/types';

export interface IncidentListItemProps {
  incident: Incident;
  onResolve: (id: number) => void;
  resolving: boolean;
  onSelect: (incident: Incident) => void;
  isSelected: boolean;
  canResolve: boolean;
}

export default function IncidentListItem({ incident, onResolve, resolving, onSelect, isSelected, canResolve }: IncidentListItemProps) {
  return (
    <div className={`flex items-center gap-3 py-2 border-b border-[#232526] rounded p-2 cursor-pointer hover:bg-[#202123] ${isSelected ? 'bg-[#202123]' : ''}`}
         onClick={() => onSelect(incident)}>
      <Image
        src={incident.thumbnailUrl}
        alt="Incident thumbnail"
        width={64}
        height={64}
        className="w-16 h-16 object-cover rounded"
      />
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <TypeIcon type={incident.type} />
          <span className="font-semibold text-white text-sm">{incident.type}</span>
        </div>
        <div className="text-xs text-gray-400">{incident.camera?.location}</div>
        <div className="text-xs text-gray-500">
          {new Date(incident.tsStart).toLocaleTimeString()} - {new Date(incident.tsEnd).toLocaleTimeString()} on {new Date(incident.tsStart).toLocaleDateString()}
        </div>
      </div>
      <button
        className={`ml-2 px-3 py-1 rounded transition-colors ${
          incident.resolved 
            ? 'bg-gray-500 text-gray-300 cursor-not-allowed' 
            : canResolve 
              ? 'bg-green-600 hover:bg-green-700 text-white' 
              : 'bg-orange-600 hover:bg-orange-700 text-white'
        }`}
        onClick={(e) => {
          e.stopPropagation();
          if (!incident.resolved && canResolve) {
            onResolve(incident.id);
          }
        }}
        disabled={resolving || incident.resolved}
      >
        {incident.resolved ? 'Resolved' : resolving ? 'Resolving...' : canResolve ? 'Resolve' : 'Login to Resolve'}
      </button>
    </div>
  );
}
