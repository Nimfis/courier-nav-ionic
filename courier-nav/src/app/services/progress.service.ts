import { Injectable } from '@angular/core';

type VisitedMap = Record<number, string>; // waypointId -> ISO date

@Injectable({ providedIn: 'root' })
export class ProgressService {
  private visited: VisitedMap = {};

  isVisited(id: number): boolean {
    return !!this.visited[id];
  }

  getVisitedAt(id: number): string | undefined {
    return this.visited[id];
  }

  markVisited(id: number): void {
    if (!this.visited[id]) {
      this.visited[id] = new Date().toISOString();
    }
  }
}
