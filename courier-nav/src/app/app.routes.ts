import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'routes', pathMatch: 'full' },

  {
    path: 'routes',
    loadComponent: () =>
      import('./pages/routes/routes.page').then((m) => m.RoutesPage),
  },
  {
    path: 'route/:id',
    loadComponent: () =>
      import('./pages/route/route.page').then((m) => m.RoutePage),
  },
  {
    path: 'waypoint/:id',
    loadComponent: () =>
      import('./pages/waypoint/waypoint.page').then((m) => m.WaypointPage),
  },

  { path: '**', redirectTo: 'routes' },
];
