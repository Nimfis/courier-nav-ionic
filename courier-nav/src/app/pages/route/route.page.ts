import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { ProgressService } from '../../services/progress.service';
import { WaypointDto } from '../../models/api.models';

@Component({
  selector: 'app-route',
  standalone: true,
  imports: [CommonModule, IonicModule],
  templateUrl: './route.page.html',
})
export class RoutePage implements OnInit {
  routeId!: number;
  waypoints: WaypointDto[] = [];
  loading = true;

  constructor(
    private ar: ActivatedRoute,
    private api: ApiService,
    private router: Router,
    private progress: ProgressService
  ) {}

  ngOnInit() {
    this.routeId = Number(this.ar.snapshot.paramMap.get('id'));

    this.api.getWaypoints(this.routeId).subscribe({
      next: (data: WaypointDto[]) => (this.waypoints = data),
      error: (e: unknown) => {
        console.error(e);
        this.loading = false;
      },
      complete: () => (this.loading = false),
    });
  }

  isVisited(id: number) {
    return this.progress.isVisited(id);
  }

  openWaypoint(waypointId: number) {
    this.router.navigate(['/waypoint', waypointId]);
  }
}
