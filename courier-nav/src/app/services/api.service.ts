import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MaterialDto, RouteDto, WaypointDto } from '../models/api.models';

@Injectable({ providedIn: 'root' })
export class ApiService {

private baseUrl = 'http://127.0.0.1:3001';

  constructor(private http: HttpClient) {}

getRoutes() {
  return this.http.get<RouteDto[]>(`${this.baseUrl}/routes`);
}

  getWaypoints(routeId: number) {
    return this.http.get<WaypointDto[]>(
      `${this.baseUrl}/waypoints?routeId=${routeId}&_sort=order`
    );
  }

  getWaypoint(id: number) {
    return this.http.get<WaypointDto>(`${this.baseUrl}/waypoints/${id}`);
  }

  getMaterials(waypointId: number) {
    return this.http.get<MaterialDto[]>(
      `${this.baseUrl}/materials?waypointId=${waypointId}`
    );
  }
}

