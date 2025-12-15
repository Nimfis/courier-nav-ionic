export interface RouteDto {
  id: number;
  name: string;
  description: string;
}

export interface WaypointDto {
  id: number;
  routeId: number;
  order: number;
  title: string;
  description: string;
  lat: number;
  lng: number;
  radiusMeters: number;
}

export interface MaterialDto {
  id: number;
  waypointId: number;
  type: 'text' | 'code' | 'audio' | 'video';
  title: string;
  content?: string;
  url?: string;
}
