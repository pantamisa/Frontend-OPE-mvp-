import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VehicleService, Vehicle } from '../../../core/services/vehicle';

@Component({
  selector: 'app-vehicle-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './vehicle-form.html',
  styleUrl: './vehicle-form.scss'
})
export class VehicleForm {
  vehicle: Vehicle = {
    placa: '',
    marca: '',
    modelo: '',
    anio: new Date().getFullYear(),
    estado: 'disponible'
  };
  saving = false;
  error = '';

  constructor(private vehicleService: VehicleService, private router: Router) {}

  save() {
    this.saving = true;
    this.vehicleService.create(this.vehicle).subscribe({
      next: () => this.router.navigate(['/vehicles']),
      error: () => { this.error = 'Error al guardar el vehículo'; this.saving = false; }
    });
  }
}