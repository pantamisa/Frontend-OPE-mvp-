import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RentalService, Rental } from '../../../core/services/rental';
import { VehicleService, Vehicle } from '../../../core/services/vehicle';
import { DriverService, Driver } from '../../../core/services/driver';

@Component({
  selector: 'app-rental-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './rental-form.html',
  styleUrl: './rental-form.scss'
})
export class RentalForm implements OnInit {
  rental: Rental = {
    vehiculo: 0,
    conductor: 0,
    fecha_inicio: new Date().toISOString().slice(0, 16),
    tipo_tarifa: 'dia',
    estado: 'activa'
  };
  vehicles: Vehicle[] = [];
  drivers: Driver[] = [];
  saving = false;
  error = '';

  constructor(
    private rentalService: RentalService,
    private vehicleService: VehicleService,
    private driverService: DriverService,
    private router: Router
  ) {}

  ngOnInit() {
    this.vehicleService.getAll().subscribe(data => this.vehicles = data);
    this.driverService.getAll().subscribe(data => this.drivers = data);
  }

  save() {
    this.saving = true;
    this.rentalService.create(this.rental).subscribe({
      next: () => this.router.navigate(['/rentals']),
      error: () => { this.error = 'Error al crear la renta'; this.saving = false; }
    });
  }
}