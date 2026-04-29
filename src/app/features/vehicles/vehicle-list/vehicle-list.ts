import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { VehicleService, Vehicle } from '../../../core/services/vehicle';

@Component({
  selector: 'app-vehicle-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './vehicle-list.html',
  styleUrl: './vehicle-list.scss'
})
export class VehicleList implements OnInit {
  vehicles: Vehicle[] = [];
  loading = true;
  error = '';

  constructor(private vehicleService: VehicleService) {}

  ngOnInit() {
    this.vehicleService.getAll().subscribe({
      next: (data) => { this.vehicles = data; this.loading = false; },
      error: () => { this.error = 'Error al cargar vehículos'; this.loading = false; }
    });
  }
}