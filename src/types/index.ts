export interface Camera {
  id: number;
  name: string;
  location: string;
}

export interface Incident {
  id: number;
  cameraId: number;
  camera: Camera;
  type: string;
  tsStart: string; // ISO string from API
  tsEnd: string;   // ISO string from API
  thumbnailUrl: string;
  videoUrl: string;
  resolved: boolean;
}

export type IncidentType = 
  | 'Gun Threat'
  | 'Unauthorized Access'
  | 'Face Recognised'
  | 'Suspicious Behavior'
  | 'Traffic congestion';
