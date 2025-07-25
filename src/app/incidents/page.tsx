"use client";
import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Header from '../components/Header';
import Timeline from '../components/Timeline';
import IncidentPlayer from '../components/IncidentPlayer';
import { Incident } from '@/types';
import { useAuth } from '@/hooks/useAuth';

export default function IncidentsPage() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  // Removed unused: const [showResolved, setShowResolved] = useState(false);
  
  const { isAuthenticated, loading: authLoading, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      router.replace('/login');
    }
  }, [isAuthenticated, authLoading, router]);

  // Fix: Define fetchIncidents with useCallback to make it stable for useEffect dependency
  const fetchIncidents = useCallback(async () => {
    if (!isAuthenticated || !user) return;
    
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`/api/incidents?userId=${user.id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch incidents');
      }
      const data = await response.json();
      setIncidents(data);
      setSelectedIncident(data[0] || null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, user]);

  // Fix: Add fetchIncidents to dependency array
  useEffect(() => {
    fetchIncidents();
  }, [fetchIncidents]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#101112] text-white flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#101112] text-white">
        <Header />
        <div className="max-w-7xl mx-auto py-8 text-center">
          <div className="text-xl">Loading incidents...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#101112] text-white">
        <Header />
        <div className="max-w-7xl mx-auto py-8 text-center">
          <div className="text-xl text-red-400">Error: {error}</div>
          <button 
            onClick={() => fetchIncidents()} 
            className="mt-4 px-4 py-2 bg-blue-600 rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#101112] text-white">
      <Header />
      <main className="max-w-7xl mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Incident Management</h1>
          <p className="text-gray-400">View and manage all security incidents across your cameras</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Timeline */}
          <div className="lg:col-span-2">
            <Timeline
              incidents={incidents}
              onSelectIncident={setSelectedIncident}
              selectedIncident={selectedIncident}
              showResolved={false}
            />
          </div>
          
          {/* Incident Player */}
          <div className="lg:col-span-1">
            {selectedIncident ? (
              <div className="sticky top-8">
                <IncidentPlayer
                  incident={selectedIncident}
                  allIncidents={incidents}
                  onIncidentSwitch={setSelectedIncident}
                />
              </div>
            ) : (
              <div className="bg-[#18191A] rounded-lg shadow-lg p-8 text-center text-gray-400 sticky top-8">
                <h2 className="text-xl font-semibold mb-4">No Incident Selected</h2>
                <p>Click on an incident in the timeline to view details</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
