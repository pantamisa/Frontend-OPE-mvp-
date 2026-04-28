// src/app/app.routes.ts
import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'rentals', pathMatch: 'full' },
  {
    path: 'vehicles',
    loadComponent: () =>
      import('./features/vehicles/vehicle-list/vehicle-list.component')
        .then(m => m.VehicleListComponent)
  },
  {
    path: 'drivers',
    loadComponent: () =>
      import('./features/drivers/driver-list/driver-list.component')
        .then(m => m.DriverListComponent)
  },
  {
    path: 'rentals',
    loadComponent: () =>
      import('./features/rentals/rental-list/rental-list.component')
        .then(m => m.RentalListComponent)
  },
  {
    path: 'reports',
    loadComponent: () =>
      import('./features/reports/reports.component')
        .then(m => m.ReportsComponent)
  },
];