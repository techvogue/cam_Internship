'use client';

import React, {
  useState,
  useMemo,
  useRef,
  useEffect,
  useCallback,
} from 'react';
import { format, parseISO, startOfDay } from 'date-fns';
import { Incident, Camera } from '@/types';

interface TimelineProps {
  incidents: Incident[];
  onSelectIncident: (incident: Incident) => void;
  selectedIncident: Incident | null;
  showResolved: boolean;
}

export default function Timeline({
  incidents,
  onSelectIncident,
  selectedIncident,
  showResolved,
}: TimelineProps) {
  /* ──────────────────────
   *  State & Refs (hooks)
   * ────────────────────── */
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [isPlaying, setIsPlaying] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);

  const timelineRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const [selectedDate] = useState<Date>(new Date());
  const startOfSelectedDay = startOfDay(selectedDate);

  /* ──────────────────────
   *  Derived data
   * ────────────────────── */
  const cameraIncidents = useMemo(() => {
    const filtered = showResolved
      ? incidents.filter((i) => i.resolved)
      : incidents.filter((i) => !i.resolved);

    const cameras = new Map<
      number,
      { camera: Camera; incidents: Incident[] }
    >();

    filtered.forEach((inc) => {
      const id = inc.camera.id;
      if (!cameras.has(id)) {
        cameras.set(id, { camera: inc.camera, incidents: [] });
      }
      cameras.get(id)!.incidents.push(inc);
    });

    return Array.from(cameras.values()).sort((a, b) =>
      a.camera.name.localeCompare(b.camera.name),
    );
  }, [incidents, showResolved]);

  /* ──────────────────────
   *  Helper utilities
   * ────────────────────── */
  const getSeverityColor = (t: string) =>
    ({
      'Gun Threat': 'bg-red-500',
      'Unauthorized Access': 'bg-orange-500',
      'Suspicious Behavior': 'bg-yellow-500',
      'Face Recognised': 'bg-blue-500',
      'Traffic congestion': 'bg-gray-500',
    }[t] ?? 'bg-gray-500');

  const getTimePosition = (time: Date) => {
    const dayMs = 86_400_000; // 24 h
    return ((time.getTime() - startOfSelectedDay.getTime()) / dayMs) * 100;
  };

  const getIncidentWidth = (incident: Incident) => {
    const start = parseISO(incident.tsStart).getTime();
    const end = parseISO(incident.tsEnd).getTime();
    const dayMs = 86_400_000;
    return Math.max(((end - start) / dayMs) * 100, 0.5);
  };

  const currentTimePosition = getTimePosition(currentTime);

  /* ──────────────────────
   *  Callbacks
   * ────────────────────── */
  const handlePlayPause = useCallback(() => {
    setIsPlaying((p) => !p);
  }, []);

  const handleStop = useCallback(() => {
    setIsPlaying(false);
    setCurrentTime(startOfSelectedDay);
  }, [startOfSelectedDay]);

  const handleSkipBackward = useCallback(() => {
    setCurrentTime((t) => new Date(t.getTime() - 10_000));
  }, []);

  const handleSkipForward = useCallback(() => {
    setCurrentTime((t) => new Date(t.getTime() + 10_000));
  }, []);

  const handlePrevIncident = useCallback(() => {
    const all = cameraIncidents
      .flatMap((c) => c.incidents)
      .sort(
        (a, b) => parseISO(a.tsStart).getTime() - parseISO(b.tsStart).getTime(),
      );

    const idx = all.findIndex((i) => i.id === selectedIncident?.id);
    if (idx > 0) {
      const prev = all[idx - 1];
      onSelectIncident(prev);
      setCurrentTime(parseISO(prev.tsStart));
    }
  }, [cameraIncidents, onSelectIncident, selectedIncident]);

  const handleNextIncident = useCallback(() => {
    const all = cameraIncidents
      .flatMap((c) => c.incidents)
      .sort(
        (a, b) => parseISO(a.tsStart).getTime() - parseISO(b.tsStart).getTime(),
      );

    const idx = all.findIndex((i) => i.id === selectedIncident?.id);
    if (idx < all.length - 1 && idx !== -1) {
      const next = all[idx + 1];
      onSelectIncident(next);
      setCurrentTime(parseISO(next.tsStart));
    }
  }, [cameraIncidents, onSelectIncident, selectedIncident]);

  const handleTimelineDrag = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!timelineRef.current) return;
      const rect = timelineRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left - 128; // 128 px camera-label gutter
      const pct = Math.max(0, Math.min(100, (x / (rect.width - 128)) * 100));
      const newTime = new Date(
        startOfSelectedDay.getTime() + (pct / 100) * 86_400_000,
      );
      setCurrentTime(newTime);
    },
    [startOfSelectedDay],
  );

  const handleMouseDown = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      setIsDragging(true);
      handleTimelineDrag(e);
    },
    [handleTimelineDrag],
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (isDragging) handleTimelineDrag(e);
    },
    [isDragging, handleTimelineDrag],
  );

  const handleMouseUp = useCallback(() => setIsDragging(false), []);

  /* ──────────────────────
   *  Playback effect
   * ────────────────────── */
  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setCurrentTime((prev) => {
          const next = new Date(prev.getTime() + 1_000 * playbackSpeed);
          const endOfDay = new Date(startOfSelectedDay.getTime() + 86_400_000);

          if (next >= endOfDay) {
            setIsPlaying(false);
            return endOfDay;
          }

          // auto-select incidents we pass
          const all = cameraIncidents
            .flatMap((c) => c.incidents)
            .sort(
              (a, b) =>
                parseISO(a.tsStart).getTime() - parseISO(b.tsStart).getTime(),
            );

          const hit = all.find((inc) => {
            const s = parseISO(inc.tsStart).getTime();
            const e = parseISO(inc.tsEnd).getTime();
            return next.getTime() >= s && next.getTime() <= e;
          });

          if (hit && hit.id !== selectedIncident?.id) {
            onSelectIncident(hit);
          }
          return next;
        });
      }, 100);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [
    isPlaying,
    playbackSpeed,
    startOfSelectedDay,
    cameraIncidents,
    onSelectIncident,
    selectedIncident,
  ]);

  /* ──────────────────────
   *  Early return (after all hooks)
   * ────────────────────── */
  if (!incidents.length) {
    return (
      <div className="bg-[#18191A] rounded-lg shadow-lg p-8 text-center text-gray-400">
        <h3 className="text-xl font-semibold mb-4">Timeline</h3>
        <p>No incidents to display</p>
      </div>
    );
  }

  /* ──────────────────────
   *  Render
   * ────────────────────── */
  return (
    <div className="bg-[#18191A] rounded-lg shadow-lg p-4">
      {/* ─── Control bar ─────────────────────────────────────────────── */}
      <div className="flex items-center justify-between mb-4 border-b border-gray-700 pb-4">
        <div className="flex items-center gap-2">
          {/* Play / pause */}
          <button
            onClick={handlePlayPause}
            className="w-10 h-10 bg-yellow-500 hover:bg-yellow-400 rounded-full flex items-center justify-center text-black"
          >
            {isPlaying ? (
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
              </svg>
            ) : (
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </button>

          {/* Prev / next */}
          <button
            onClick={handlePrevIncident}
            className="w-8 h-8 bg-gray-700 hover:bg-gray-600 rounded flex items-center justify-center text-white"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
            </svg>
          </button>
          <button
            onClick={handleNextIncident}
            className="w-8 h-8 bg-gray-700 hover:bg-gray-600 rounded flex items-center justify-center text-white"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
            </svg>
          </button>

          {/* Stop */}
          <button
            onClick={handleStop}
            className="w-8 h-8 bg-gray-700 hover:bg-gray-600 rounded flex items-center justify-center text-white"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6 6h12v12H6z" />
            </svg>
          </button>

          {/* Skip -10 / +10 */}
          <button
            onClick={handleSkipBackward}
            className="w-8 h-8 bg-gray-700 hover:bg-gray-600 rounded flex items-center justify-center text-white"
            title="Back 10 s"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M11 18V6l-8.5 6L11 18zM11.5 12l8.5 6V6l-8.5 6z" />
            </svg>
          </button>
          <button
            onClick={handleSkipForward}
            className="w-8 h-8 bg-gray-700 hover:bg-gray-600 rounded flex items-center justify-center text-white"
            title="Forward 10 s"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M13 6v12l8.5-6L13 6zM2.5 6v12L11 12 2.5 6z" />
            </svg>
          </button>
        </div>

        {/* Current time */}
        <div className="text-yellow-400 font-mono text-lg">
          {format(currentTime, 'HH:mm:ss')} (
          {format(selectedDate, 'dd-MMM-yyyy')})
        </div>

        {/* Playback speed */}
        <div className="flex items-center gap-2">
          <select
            value={playbackSpeed}
            onChange={(e) => setPlaybackSpeed(Number(e.target.value))}
            className="bg-gray-700 text-white text-sm rounded px-2 py-1 border border-gray-600"
          >
            <option value={0.5}>0.5×</option>
            <option value={1}>1×</option>
            <option value={2}>2×</option>
            <option value={4}>4×</option>
          </select>
        </div>
      </div>

      {/* ─── Camera list header ──────────────────────────────────────── */}
      <div className="text-yellow-400 font-semibold mb-2 text-sm">
        Camera List
      </div>

      {/* ─── Timeline ────────────────────────────────────────────────── */}
      <div className="relative bg-gray-900 border border-gray-700 rounded">
        {/* Hours scale */}
        <div className="flex border-b border-gray-700 bg-gray-800">
          <div className="w-32 flex-shrink-0" /> {/* gutter */}
          <div className="flex-1 relative h-8">
            {Array.from({ length: 12 }, (_, i) => i * 2).map((h) => (
              <div
                key={h}
                className="absolute text-xs text-gray-400 -translate-x-1/2"
                style={{ left: `${(h / 24) * 100}%`, top: '6px' }}
              >
                {h.toString().padStart(2, '0')}:00
              </div>
            ))}
          </div>
        </div>

        {/* Camera rows */}
        <div
          className="relative select-none"
          ref={timelineRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {cameraIncidents.map(({ camera, incidents: list }) => (
            <div
              key={camera.id}
              className="flex border-b border-gray-700 hover:bg-gray-800/50"
            >
              {/* label */}
              <div className="w-32 flex-shrink-0 p-2 bg-gray-800 flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2" />
                <span className="text-white text-sm truncate">
                  {camera.name}
                </span>
              </div>

              {/* track */}
              <div className="flex-1 relative h-12 bg-gray-900">
                {list.map((inc) => {
                  const left = getTimePosition(parseISO(inc.tsStart));
                  const width = getIncidentWidth(inc);
                  const selected = selectedIncident?.id === inc.id;

                  return (
                    <div
                      key={inc.id}
                      className={`absolute h-8 top-2 rounded cursor-pointer transition-opacity ${
                        getSeverityColor(inc.type)
                      } ${selected ? 'ring-2 ring-yellow-400' : 'hover:opacity-80'}`}
                      style={{
                        left: `${Math.max(0, Math.min(left, 100))}%`,
                        width: `${Math.min(
                          width,
                          100 - Math.max(0, left),
                        )}%`,
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectIncident(inc);
                        setCurrentTime(parseISO(inc.tsStart));
                      }}
                      title={`${inc.type} – ${format(
                        parseISO(inc.tsStart),
                        'HH:mm',
                      )}`}
                    >
                      {/* overlapping-incidents counter */}
                      {list.filter(
                        (i) =>
                          Math.abs(
                            parseISO(i.tsStart).getTime() -
                              parseISO(inc.tsStart).getTime(),
                          ) < 300_000,
                      ).length > 1 && (
                        <div className="absolute -top-1 -right-1 bg-yellow-500 text-black text-xs px-1 rounded-full">
                          {
                            list.filter(
                              (i) =>
                                Math.abs(
                                  parseISO(i.tsStart).getTime() -
                                    parseISO(inc.tsStart).getTime(),
                                ) < 300_000,
                            ).length
                          }
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          {/* playback cursor */}
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-yellow-400 z-20 pointer-events-none"
            style={{ left: `calc(128px + ${currentTimePosition}%)` }}
          >
            <div className="absolute -top-1 -left-1.5 w-3 h-3 bg-yellow-400 rounded-full" />
          </div>
        </div>
      </div>

      {/* ─── Legend ─────────────────────────────────────────────────── */}
      <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-gray-400">
        {[
          ['Gun Threat', 'bg-red-500'],
          ['Unauthorized Access', 'bg-orange-500'],
          ['Face Recognised', 'bg-blue-500'],
          ['Suspicious Behavior', 'bg-yellow-500'],
          ['Traffic Congestion', 'bg-gray-500'],
        ].map(([label, cls]) => (
          <div key={label} className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded ${cls}`} />
            <span>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
