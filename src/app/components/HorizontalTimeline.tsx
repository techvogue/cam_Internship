import { Camera, Incident } from '@/types';
import { differenceInMinutes, parseISO, startOfDay } from 'date-fns';
import React, { useEffect, useMemo, useRef, useState } from 'react';

const INCIDENT_COLORS: Record<string, string> = {
  'Gun Threat': '#dc2626',
  'Unauthorized Access': '#ea580c',
  'Suspicious Behavior': '#ca8a04',
  'Face Recognised': '#2563eb',
  'Traffic congestion': '#6b7280',
};

const INCIDENT_ICONS: Record<string, string> = {
  'Gun Threat': '⚠️',
  'Unauthorized Access': '🔒',
  'Suspicious Behavior': '👁️',
  'Face Recognised': '👤',
  'Traffic congestion': '🚗',
};

interface HorizontalTimelineProps {
  incidents: Incident[];
  cameras: Camera[];
  selectedIncident: Incident | null;
  onSelectIncident: (incident: Incident) => void;
}

export default function HorizontalTimeline({
  incidents,
  cameras,
  selectedIncident,
  onSelectIncident,
}: HorizontalTimelineProps) {
  // SVG layout - UNCHANGED
  const svgHeight = 80 + cameras.length * 48;
  const timelineY = 40;
  const leftPad = 120;
  const rightPad = 40;
  const rowHeight = 36;
  const rowGap = 12;

  // Responsive width - UNCHANGED
  const containerRef = useRef<HTMLDivElement>(null);
  const [svgWidth, setSvgWidth] = useState(1000);
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        setSvgWidth(containerRef.current.offsetWidth);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  const timelineLength = svgWidth - leftPad - rightPad;
  const getX = (minutes: number) => leftPad + (minutes / (24 * 60)) * timelineLength;

  // Group incidents by camera - UNCHANGED
  const cameraIncidents = useMemo(() => {
    const map = new Map<number, { camera: Camera; incidents: Incident[] }>();
    for (const cam of cameras) map.set(cam.id, { camera: cam, incidents: [] });
    for (const inc of incidents) {
      if (map.has(inc.cameraId)) map.get(inc.cameraId)!.incidents.push(inc);
    }
    return Array.from(map.values());
  }, [incidents, cameras]);

  // Scrubber state - UNCHANGED
  const [scrubberMinutes, setScrubberMinutes] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  // Play/pause state - UNCHANGED
  const [isPlaying, setIsPlaying] = useState(false);

  // Snap scrubber to selected incident - UNCHANGED
  useEffect(() => {
    if (selectedIncident) {
      const start = parseISO(selectedIncident.tsStart);
      const dayStart = startOfDay(start);
      const minutes = differenceInMinutes(start, dayStart);
      setScrubberMinutes(minutes);
    }
  }, [selectedIncident]);

  // Play/pause auto-advance - UNCHANGED
  useEffect(() => {
    if (!isPlaying) return;
    let raf: number;
    let last = Date.now();
    const step = () => {
      const now = Date.now();
      const dt = (now - last) / 1000; // seconds
      last = now;
      setScrubberMinutes(prev => {
        const next = prev + dt * 12; // 12 minutes per second (adjust speed as needed)
        if (next > 24 * 60) {
          setIsPlaying(false);
          return 24 * 60;
        }
        // Snap to incident if close
        let nearest: Incident | null = null, minDiff = 9999;
        for (const { incidents } of cameraIncidents) {
          for (const inc of incidents) {
            const start = parseISO(inc.tsStart);
            const dayStart = startOfDay(start);
            const minutes = differenceInMinutes(start, dayStart);
            const diff = Math.abs(minutes - next);
            if (diff < minDiff) {
              minDiff = diff;
              nearest = inc;
            }
          }
        }
        if (nearest && minDiff < 2) {
          onSelectIncident(nearest);
        }
        return next;
      });
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [isPlaying, cameraIncidents, onSelectIncident]);

  // Drag handlers - UNCHANGED
  const svgRef = useRef<SVGSVGElement>(null);
  const handleDrag = (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const px = Math.max(leftPad, Math.min(svgWidth - rightPad, x));
    const minutes = ((px - leftPad) / timelineLength) * (24 * 60);
    setScrubberMinutes(minutes);
  };
  const handleDragEnd = () => {
    setIsDragging(false);
    // Snap to nearest incident
    let nearest: Incident | null = null, minDiff = Infinity;
    for (const { incidents } of cameraIncidents) {
      for (const inc of incidents) {
        const start = parseISO(inc.tsStart);
        const dayStart = startOfDay(start);
        const minutes = differenceInMinutes(start, dayStart);
        const diff = Math.abs(minutes - scrubberMinutes);
        if (diff < minDiff) {
          minDiff = diff;
          nearest = inc;
        }
      }
    }
    if (nearest) {
      setScrubberMinutes(differenceInMinutes(parseISO(nearest.tsStart), startOfDay(parseISO(nearest.tsStart))));
      onSelectIncident(nearest);
    }
  };

  return (
    <div 
      ref={containerRef} 
      className="w-full bg-[#0b0c10] rounded-xl border-2 border-gray-700 shadow-2xl shadow-black/80 p-6" 
      style={{ overflowX: 'auto' }}
    >
      {/* Play/Pause Controls */}
      <div className="flex items-center gap-6 mb-4 p-4 bg-[#1c1f26] rounded-lg border border-gray-700">
        <button
          className={`w-12 h-12 rounded-full flex items-center justify-center text-xl transition-all duration-200 border-2 ${
            isPlaying 
              ? 'bg-amber-500 text-black border-amber-500 hover:bg-amber-400' 
              : 'bg-gray-700 text-white border-gray-600 hover:bg-gray-600'
          }`}
          onClick={() => setIsPlaying(p => !p)}
          title={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? (
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <rect x="6" y="4" width="4" height="16" rx="1" />
              <rect x="14" y="4" width="4" height="16" rx="1" />
            </svg>
          ) : (
            <svg className="w-6 h-6 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
              <polygon points="8,5 8,19 19,12" />
            </svg>
          )}
        </button>
        
        <div className="bg-[#22252e] px-4 py-2 rounded-lg border-2 border-gray-600">
          <span className="text-white font-mono text-sm">
            {`${String(Math.floor(scrubberMinutes / 60)).padStart(2, '0')}:${String(Math.floor(scrubberMinutes % 60)).padStart(2, '0')}`}
          </span>
        </div>
      </div>

      <svg
        ref={svgRef}
        width="100%"
        height={svgHeight}
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        style={{ width: '100%', minWidth: '300px', display: 'block' }}
        onMouseMove={isDragging ? handleDrag : undefined}
        onMouseUp={isDragging ? handleDragEnd : undefined}
        onMouseLeave={isDragging ? handleDragEnd : undefined}
        className="bg-[#16181f] rounded-lg border border-gray-700"
      >
        {/* SVG Definitions */}
        <defs>
          <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="2" dy="2" stdDeviation="2" floodColor="#000000" floodOpacity="0.3"/>
          </filter>
        </defs>

        {/* Timeline ruler */}
        <rect 
          x={2} 
          y={2} 
          width={svgWidth - 4} 
          height={svgHeight - 4} 
          rx={8} 
          fill="none" 
          stroke="#ffffff" 
          strokeWidth={2} 
          opacity={0.8}
        />
        
        <line 
          x1={leftPad} 
          y1={timelineY} 
          x2={svgWidth - rightPad} 
          y2={timelineY} 
          stroke="#e5e7eb" 
          strokeWidth={4} 
          strokeLinecap="round" 
        />

        {/* Time labels and ticks */}
        {Array.from({ length: 13 }).map((_, i) => {
          const hour = i * 2;
          const x = getX(hour * 60);
          return (
            <g key={hour}>
              <line 
                x1={x} 
                y1={timelineY - 16} 
                x2={x} 
                y2={timelineY + 16 + cameras.length * (rowHeight + rowGap)} 
                stroke="#6b7280" 
                strokeWidth={hour % 6 === 0 ? 2 : 1} 
                opacity={0.6}
              />
              <text 
                x={x} 
                y={timelineY - 22} 
                textAnchor="middle" 
                fontSize={hour % 6 === 0 ? 12 : 9} 
                fill="#f9fafb" 
                fontFamily="monospace"
              >
                {hour.toString().padStart(2, '0') + ':00'}
              </text>
            </g>
          );
        })}

        {/* Camera rows and incident blocks */}
        {cameraIncidents.map((row, idx) => {
          const y = timelineY + 32 + idx * (rowHeight + rowGap);
          return (
            <g key={row.camera.id}>
              {/* Camera row background */}
              <rect
                x={leftPad - 5}
                y={y - 2}
                width={timelineLength + 10}
                height={rowHeight + 4}
                rx={4}
                fill={idx % 2 === 0 ? "#1c1f26" : "#16181f"}
                stroke="#374151"
                strokeWidth={1}
                opacity={0.3}
              />

              {/* Camera label */}
              <rect
                x={10}
                y={y - 1}
                width={leftPad - 10}
                height={rowHeight + 2}
                rx={6}
                fill="#22252e"
                stroke="#4b5563"
                strokeWidth={1}
                filter="url(#shadow)"
              />
              <text 
                x={leftPad - 10} 
                y={y + rowHeight / 2 + 4} 
                textAnchor="end" 
                fontSize={10} 
                fill="#ffffff"
              >
                {row.camera.name}
              </text>

              {/* Incident blocks */}
              {row.incidents.map((incident: Incident) => {
                const start = parseISO(incident.tsStart);
                const end = parseISO(incident.tsEnd);
                const dayStart = startOfDay(start);
                const x = getX(differenceInMinutes(start, dayStart));
                const xEnd = getX(differenceInMinutes(end, dayStart));
                
                // Calculate text width to make background cover all text
                const textLength = incident.type.length * 5.5; // Approximate character width for fontSize 9
                const minWidth = 30 + textLength + 10; // Icon space + text + padding
                const width = Math.max(xEnd - x, minWidth);
                
                const isSelected = selectedIncident?.id === incident.id;
                const incidentColor = INCIDENT_COLORS[incident.type] || '#6b7280';

                return (
                  <g key={incident.id} style={{ cursor: 'pointer' }} onClick={() => onSelectIncident(incident)}>
                    {/* Main incident background - now covers all text */}
                    <rect
                      x={x}
                      y={y}
                      width={width}
                      height={rowHeight}
                      rx={8}
                      fill={isSelected ? incidentColor : '#374151'}
                      stroke={isSelected ? '#fbbf24' : '#4b5563'}
                      strokeWidth={isSelected ? 3 : 2}
                      opacity={isSelected ? 1 : 0.8}
                      filter="url(#shadow)"
                    />
                    
                    {/* Icon background circle */}
                    <circle
                      cx={x + 14}
                      cy={y + rowHeight / 2}
                      r={8}
                      fill="rgba(255,255,255,0.15)"
                      stroke="rgba(255,255,255,0.4)"
                      strokeWidth={1}
                    />
                    
                    {/* Icon */}
                    <text 
                      x={x + 14} 
                      y={y + rowHeight / 2 + 3} 
                      fontSize={10} 
                      fill="#ffffff"
                      textAnchor="middle"
                    >
                      {INCIDENT_ICONS[incident.type] || '⚠️'}
                    </text>
                    
                    {/* Incident Type Text */}
                    <text 
                      x={x + 28} 
                      y={y + rowHeight / 2 + 3} 
                      fontSize={9} 
                      fill="#ffffff"
                      textAnchor="start"
                    >
                      {incident.type}
                    </text>

                    {/* Duration text - only show if there's extra space */}
                    {width > minWidth + 30 && (
                      <text 
                        x={x + width - 6} 
                        y={y + rowHeight - 4} 
                        fontSize={7} 
                        textAnchor="end" 
                        fill="rgba(255,255,255,0.7)"
                        fontFamily="monospace"
                      >
                        {Math.round(differenceInMinutes(end, start))}min
                      </text>
                    )}
                  </g>
                );
              })}
            </g>
          );
        })}

        {/* Scrubber line */}
        <g 
          style={{ cursor: 'pointer' }} 
          onMouseDown={e => { 
            setIsDragging(true); 
            handleDrag(e as React.MouseEvent<SVGSVGElement, MouseEvent>); 
          }}
        >
          <line
            x1={getX(scrubberMinutes)}
            y1={timelineY - 18}
            x2={getX(scrubberMinutes)}
            y2={timelineY + 32 + cameras.length * (rowHeight + rowGap)}
            stroke="#fbbf24"
            strokeWidth={3}
            strokeDasharray="6 4"
            opacity={0.9}
          />
          
          <circle
            cx={getX(scrubberMinutes)}
            cy={timelineY}
            r={14}
            fill="#fbbf24"
            stroke="#ffffff"
            strokeWidth={2}
            filter="url(#shadow)"
          />
          
          <circle
            cx={getX(scrubberMinutes)}
            cy={timelineY}
            r={8}
            fill="#111827"
          />
        </g>
      </svg>
    </div>
  );
}
