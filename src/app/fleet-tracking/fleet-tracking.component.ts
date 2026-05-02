import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-fleet-tracking',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="placeholder-page">
      <h1 class="page-title">Seguimiento de Flota</h1>
      <div class="placeholder-body">
        <div class="placeholder-icon">🚗</div>
        <p class="placeholder-text">Esta sección está en construcción.<br/>Aquí se mostrará el seguimiento en tiempo real de la flota.</p>
      </div>
    </div>
  `,
  styles: [`
    .placeholder-page { padding: 0; }
    .page-title { font-size: 24px; font-weight: 800; color: #111; margin-bottom: 2rem; }
    .placeholder-body {
      display: flex; flex-direction: column; align-items: center; justify-content: center;
      min-height: 340px; background: #f9fdf9; border: 2px dashed #6ec47a; border-radius: 12px;
      gap: 1rem;
    }
    .placeholder-icon { font-size: 56px; }
    .placeholder-text { font-size: 15px; color: #555; text-align: center; line-height: 1.6; }
  `]
})
export class FleetTrackingComponent {}
