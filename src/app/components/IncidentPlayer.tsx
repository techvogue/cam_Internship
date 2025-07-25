import { Incident } from '@/types';
import { useState, useEffect } from 'react';
import TypeIcon from './TypeIcon';
import Image from 'next/image';

export default function IncidentPlayer({ incident, allIncidents, onIncidentSwitch, showResolved }: {
    incident: Incident;
    allIncidents: Incident[];
    onIncidentSwitch?: (incident: Incident) => void;
    showResolved?: boolean;
}) {
    const [mainIncident, setMainIncident] = useState<Incident>(incident);
    const [cameraIncidents, setCameraIncidents] = useState<Incident[]>([]);
    const [isPlaying, setIsPlaying] = useState<boolean>(true);

    useEffect(() => {
        setMainIncident(incident);
        
        // Get first incident from each unique camera (excluding the main incident's camera)
        // Filter based on resolved status to match the current view
        const uniqueCameras = new Map<number, Incident>();
        
        // Check if allIncidents is defined before calling forEach
        let filteredIncidents: Incident[] = [];
        
        if (allIncidents && Array.isArray(allIncidents)) {
            // Filter incidents based on the current view (resolved or unresolved)
            // If showResolved is not defined, default to showing unresolved incidents
            filteredIncidents = allIncidents.filter(inc => 
                showResolved ? inc.resolved : !inc.resolved
            );
            
            // Sort incidents by timestamp to get the most recent first
            const sortedIncidents = filteredIncidents.sort((a, b) => 
                new Date(b.tsStart).getTime() - new Date(a.tsStart).getTime()
            );
            
            // Debug logging
            console.log('IncidentPlayer Debug:', {
                mainIncidentCamera: incident.camera.name,
                mainIncidentId: incident.id,
                showResolved,
                totalIncidents: allIncidents.length,
                filteredIncidents: filteredIncidents.length,
                availableCameras: [...new Set(filteredIncidents.map(i => `${i.camera.name} (${i.camera.id})`))]
            });
            
            sortedIncidents.forEach(inc => {
                // Include incidents from different cameras than the main one
                if (inc.camera.id !== incident.camera.id && !uniqueCameras.has(inc.camera.id)) {
                    uniqueCameras.set(inc.camera.id, inc);
                }
            });
            
            console.log('Selected camera incidents:', Array.from(uniqueCameras.values()).map(i => `${i.camera.name}: ${i.type}`));
        }
        
        // Convert to array and get up to 3 camera incidents for the grid
        let otherCameraIncidents = Array.from(uniqueCameras.values()).slice(0, 3);
        
        // If we have fewer than 3 unique cameras, try to fill with additional incidents from same cameras
        if (otherCameraIncidents.length < 3 && filteredIncidents.length > 0) {
            const additionalIncidents = filteredIncidents.filter(inc => 
                inc.camera.id !== incident.camera.id &&  // Exclude main incident camera
                !otherCameraIncidents.some(existing => existing.camera.id === inc.camera.id) // Exclude already selected cameras
            ).slice(0, 3 - otherCameraIncidents.length);
            otherCameraIncidents = otherCameraIncidents.concat(additionalIncidents);
        }
        
        setCameraIncidents(otherCameraIncidents);
    }, [incident, allIncidents, showResolved]);

    const handleIncidentSwitch = (newIncident: Incident) => {
        setMainIncident(newIncident);
        setIsPlaying(false);
        setTimeout(() => setIsPlaying(true), 100);
        
        if (onIncidentSwitch) {
            onIncidentSwitch(newIncident);
        }
    };


    return (
        <div className="bg-[#18191A] rounded-lg shadow-lg p-4 flex flex-col">
            {/* Main Player */}
            <div className="relative mb-4">
                <div className="relative">
                    <video
                        src={mainIncident.videoUrl}
                        controls
                        poster={mainIncident.thumbnailUrl}
                        className="w-full h-80 object-cover rounded border-4 border-red-600"
                    />
                    {/* Play/Pause Overlay */}
                    {!isPlaying && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded">
                            <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M8 5v14l11-7z"/>
                                </svg>
                            </div>
                        </div>
                    )}
                    {/* Camera Info */}
                    <div className="absolute bottom-2 left-2 bg-black bg-opacity-70 text-white text-sm px-3 py-1 rounded">
                        <div className="font-semibold">{mainIncident.camera.name}</div>
                        <div className="text-xs text-gray-300">{mainIncident.camera.location}</div>
                    </div>
                    {/* Live Indicator */}
                    <div className="absolute top-2 left-2 bg-red-600 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
                        <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                        LIVE
                    </div>
                    {/* Incident Type with Icon */}
                    <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-white text-sm px-3 py-1 rounded flex items-center gap-2">
                        <TypeIcon type={mainIncident.type} />
                        {mainIncident.type}
                    </div>
                </div>
            </div>
            
            {/* Camera Grid - First incident from each of the other 3 cameras (filtered by resolved status) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-4">
                {cameraIncidents.map((cameraIncident, index) => (
                    <div 
                        key={`${cameraIncident.id}-${index}`} 
                        className="relative cursor-pointer hover:scale-105 transition-transform duration-200"
                        onClick={() => handleIncidentSwitch(cameraIncident)}
                    >
                        <div className="relative">
                            <Image 
                                src={cameraIncident.thumbnailUrl}
                                alt={`${cameraIncident.camera.name} incident`} 
                                width={640}
                                height={320}
                                className="w-full h-24 object-cover rounded border-2 border-gray-600 hover:border-blue-500" 
                            />
                            {/* Camera Name and Incident Type */}
                            <div className="absolute bottom-1 left-1 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                                <div className="font-semibold">{cameraIncident.camera.name}</div>
                                <div className="flex items-center gap-1 mt-1">
                                    <TypeIcon type={cameraIncident.type} />
                                    <span>{cameraIncident.type}</span>
                                </div>
                            </div>
                            {/* Time indicator */}
                            <div className="absolute top-1 right-1 bg-black bg-opacity-70 text-white text-xs px-1 py-1 rounded">
                                {new Date(cameraIncident.tsStart).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                            </div>
                            {/* Click to Switch Indicator */}
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 bg-black bg-opacity-50 rounded transition-opacity">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 002 2v8a2 2 0 002 2z" />
                                </svg>
                            </div>
                        </div>
                    </div>
                ))}
                
                {/* Empty slots if less than 3 cameras with incidents matching current filter */}
            </div>
            
            {/* Player Controls */}
            <div className="flex items-center justify-between mt-4 px-2">
                <div className="flex items-center gap-3">
                    <button 
                        onClick={() => setIsPlaying(!isPlaying)}
                        className="w-10 h-10 bg-gray-700 hover:bg-gray-600 rounded-full flex items-center justify-center text-white"
                    >
                        {isPlaying ? (
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
                            </svg>
                        ) : (
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M8 5v14l11-7z"/>
                            </svg>
                        )}
                    </button>
                    <div className="text-white text-sm">
                        {new Date(mainIncident.tsStart).toLocaleTimeString()} - {new Date(mainIncident.tsEnd).toLocaleTimeString()}
                    </div>
                </div>
                <div className="text-gray-400 text-sm">
                    Camera: {mainIncident.camera.name} | ID: {mainIncident.id}
                </div>
            </div>
        </div>
    );
}
