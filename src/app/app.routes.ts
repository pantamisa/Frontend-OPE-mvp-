import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'vehicles', pathMatch: 'full' },
  {
    path: 'vehicles',
    loadComponent: () =>
      import('./features/vehicles/vehicle-list/vehicle-list')
        .then(m => m.VehicleList)
  },
  {
    path: 'vehicles/new',
    loadComponent: () =>
      import('./features/vehicles/vehicle-form/vehicle-form')
        .then(m => m.VehicleForm)
  },
  {
    path: 'drivers',
    loadComponent: () =>
      import('./features/drivers/driver-list/driver-list')
        .then(m => m.DriverList)
  },
  {
    path: 'drivers/new',
    loadComponent: () =>
      import('./features/drivers/driver-form/driver-form')
        .then(m => m.DriverForm)
  },
  {
    path: 'rentals',
    loadComponent: () =>
      import('./features/rentals/rental-list/rental-list')
        .then(m => m.RentalList)
  },
  {
    path: 'rentals/new',
    loadComponent: () =>
      import('./features/rentals/rental-form/rental-form')
        .then(m => m.RentalForm)
  },
  {
    path: 'rentals/:id',
    loadComponent: () =>
      import('./features/rentals/rental-detail/rental-detail')
        .then(m => m.RentalDetail)
  },
  {
    path: 'reports',
    loadComponent: () =>
      import('./features/reports/report-view/report-view')
        .then(m => m.ReportView)
  },
];