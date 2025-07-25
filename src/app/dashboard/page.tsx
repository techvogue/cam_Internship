"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '../components/Header';
import IncidentList from '../components/IncidentList';
import IncidentPlayer from '../components/IncidentPlayer';
import HorizontalTimeline from '../components/HorizontalTimeline';
import { Incident, Camera } from '@/types';
import { useAuth } from '@/hooks/useAuth';
import Footer from '../components/Footer';

export default function DashboardPage() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [allIncidents, setAllIncidents] = useState<Incident[]>([]);
  const [cameras, setCameras] = useState<Camera[]>([]);
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [resolvingId, setResolvingId] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showResolved, setShowResolved] = useState<boolean>(false);
  
  const { isAuthenticated, loading: authLoading, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      // Clear any invalid auth data before redirecting
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      router.replace('/login');
    }
  }, [isAuthenticated, authLoading, router]);

  useEffect(() => {
    if (isAuthenticated && user) {
      const fetchIncidents = async () => {
        try {
          setLoading(true);
          setError(null);
          // Fetch all incidents first
          const allRes = await fetch(`/api/incidents?userId=${user?.id}`, {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
          });
          if (!allRes.ok) {
            throw new Error('Failed to fetch incidents');
          }
          const allData = await allRes.json();
          setAllIncidents(allData);
          // Filter incidents based on resolved status for the list
          const filteredData = allData.filter((inc: Incident) => 
            showResolved ? inc.resolved : !inc.resolved
          );
          setIncidents(filteredData);
          setSelectedIncident(filteredData[0] || null);
        } catch (err) {
          setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
          setLoading(false);
        }
      };
      fetchIncidents();
      const fetchCameras = async () => {
        try {
          const response = await fetch('/api/cameras', {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
          });
          if (!response.ok) {
            throw new Error('Failed to fetch cameras');
          }
          const cameraData = await response.json();
          setCameras(cameraData);
        } catch (err) {
          console.error('Failed to fetch cameras:', err);
        }
      };
      fetchCameras();
    }
  }, [showResolved, isAuthenticated, user]);

  const handleResolve = async (id: number) => {
    if (!isAuthenticated || !user) {
      router.push('/login');
      return;
    }

    setResolvingId(id);
    try {
      const response = await fetch(`/api/incidents/${id}/resolve`, { 
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error('Failed to resolve incident');
      }
      
      // Refresh incidents after successful resolution
      const fetchIncidents = async () => {
        try {
          setLoading(true);
          setError(null);
          // Fetch all incidents first
          const allRes = await fetch(`/api/incidents?userId=${user?.id}`, {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
          });
          if (!allRes.ok) {
            throw new Error('Failed to fetch incidents');
          }
          const allData = await allRes.json();
          setAllIncidents(allData);
          // Filter incidents based on resolved status for the list
          const filteredData = allData.filter((inc: Incident) => 
            showResolved ? inc.resolved : !inc.resolved
          );
          setIncidents(filteredData);
          setSelectedIncident(filteredData[0] || null);
        } catch (err) {
          setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
          setLoading(false);
        }
      };
      await fetchIncidents();
      
    } catch (error) {
      console.error('Failed to resolve incident:', error);
    } finally {
      setResolvingId(null);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#101112] text-white flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect in useEffect
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
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-blue-600 rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#101112] text-white flex flex-col">
      {/* Enhanced Header */}
      <Header />
      <main className="max-w-7xl mx-auto flex gap-6 py-8 flex-1">
        <section className="flex-1">
          {selectedIncident ? (
            <IncidentPlayer
              incident={selectedIncident}
              allIncidents={allIncidents}
              onIncidentSwitch={setSelectedIncident}
              showResolved={showResolved}
            />
          ) : (
            <div className="bg-[#18191A] rounded-lg shadow-lg p-8 text-center text-gray-400">
              <h2 className="text-xl font-semibold mb-4">No Active Incidents</h2>
              <p>All incidents have been resolved or no incidents are currently active.</p>
            </div>
          )}
        </section>
        <IncidentList
          incidents={incidents}
          onResolve={handleResolve}
          resolvingId={resolvingId}
          selectedIncident={selectedIncident}
          onSelectIncident={setSelectedIncident}
          showResolved={showResolved}
          onToggleResolved={setShowResolved}
          isAuthenticated={isAuthenticated}
        />
      </main>
      {/* Horizontal Timeline - Using filtered incidents based on showResolved */}
      <div className="w-full mx-auto mt-0 px-5">
        <HorizontalTimeline
          incidents={incidents}
          cameras={cameras}
          onSelectIncident={setSelectedIncident}
          selectedIncident={selectedIncident}
        />
      </div>
      {/* Footer */}
      <Footer />
    </div>
  );
}
