import React from 'react';
import IncidentListItem from './IncidentListItem';
import { Incident } from '@/types';

export default function IncidentList({ incidents, onResolve, resolvingId, selectedIncident, onSelectIncident, showResolved, onToggleResolved, isAuthenticated }: {
  incidents: Incident[];
  onResolve: (id: number) => void;
  resolvingId: number | null;
  selectedIncident: Incident | null;
  onSelectIncident: (incident: Incident) => void;
  showResolved: boolean;
  onToggleResolved: (showResolved: boolean) => void;
  isAuthenticated: boolean;
}) {
  return (
    <aside className="w-full max-w-md bg-[#18191A] p-4 rounded-lg shadow-lg flex flex-col" style={{height: '550px'}}>
      <div className="flex items-center justify-between mb-4 flex-shrink-0">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <span className={`text-xl ${showResolved ? 'text-green-500' : 'text-red-500'}`}>●</span> 
          {incidents.length} {showResolved ? 'Resolved' : 'Unresolved'} Incidents
        </h2>
        <div className="flex gap-2">
          <button 
            className={`px-2 py-1 rounded text-xs ${!showResolved ? 'bg-orange-600 text-white' : 'bg-gray-700 text-gray-400'}`}
            onClick={() => onToggleResolved(false)}
          >
            Unresolved
          </button>
          <button 
            className={`px-2 py-1 rounded text-xs ${showResolved ? 'bg-green-600 text-white' : 'bg-gray-700 text-gray-400'}`}
            onClick={() => onToggleResolved(true)}
          >
            Resolved
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto space-y-2 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
        {incidents.map((incident) => (
          <IncidentListItem
            key={incident.id}
            incident={incident}
            onResolve={onResolve}
            resolving={resolvingId === incident.id}
            onSelect={onSelectIncident}
            isSelected={selectedIncident?.id === incident.id}
            canResolve={isAuthenticated}
          />
        ))}
        {incidents.length === 0 && (
          <div className="text-center text-gray-400 py-8">
            <p>No {showResolved ? 'resolved' : 'unresolved'} incidents found</p>
          </div>
        )}
      </div>
    </aside>
  );
} 