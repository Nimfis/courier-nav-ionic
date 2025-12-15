import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';

import { ApiService } from '../../services/api.service';
import { RouteDto } from '../../models/api.models';

@Component({
  selector: 'app-routes',
  standalone: true,
  imports: [CommonModule, IonicModule],
  templateUrl: './routes.page.html',
})
export class RoutesPage implements OnInit {
  routes: RouteDto[] = [];
  loading = true;

  constructor(private api: ApiService, private router: Router) {}

  ngOnInit() {
    this.api.getRoutes().subscribe({
      next: (data: RouteDto[]) => (this.routes = data),
      error: (e: unknown) => {
        console.error(e);
        this.loading = false;
      },
      complete: () => (this.loading = false),
    });
  }

  openRoute(id: number | string) {
    this.router.navigate(['/route', Number(id)]);
  }
}
