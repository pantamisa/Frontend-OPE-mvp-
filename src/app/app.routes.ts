import { Routes } from '@angular/router';

// Auth
import { LoginComponent }    from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';

// Shell
import { LayoutComponent } from './shared/layout/layout.component';

// Pages
import { DashboardComponent }           from './dashboard/dashboard.component';
import { FleetTrackingComponent }       from './fleet-tracking/fleet-tracking.component';
import { TrackingControlComponent }     from './tracking-control/tracking-control.component';
import { MaintenanceRequestsComponent } from './maintenance-requests/maintenance-requests.component';
import { ConsumptionReportsComponent }  from './consumption-reports/consumption-reports.component';
import { DriverRegisterComponent }      from './driver-register/driver-register.component';
import { VehicleRegisterComponent }     from './vehicle-register/vehicle-register.component';
import { RentalsComponent }             from './rentals/rentals.component';

export const routes: Routes = [
  // ── Public ──────────────────────────────────────
  { path: '',         redirectTo: 'login', pathMatch: 'full' },
  { path: 'login',    component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  // ── Protected (inside layout shell) ─────────────
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: 'dashboard',            component: DashboardComponent },
      { path: 'fleet-tracking',       component: FleetTrackingComponent },
      { path: 'tracking-control',     component: TrackingControlComponent },
      { path: 'maintenance-requests', component: MaintenanceRequestsComponent },
      { path: 'consumption-reports',  component: ConsumptionReportsComponent },
      { path: 'driver-register',      component: DriverRegisterComponent },
      { path: 'vehicle-register',     component: VehicleRegisterComponent },
      { path: 'rentals',              component: RentalsComponent },
    ]
  },

  { path: '**', redirectTo: 'login' }
];
