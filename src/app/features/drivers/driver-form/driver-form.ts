import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DriverService, Driver } from '../../../core/services/driver';

@Component({
  selector: 'app-driver-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './driver-form.html',
  styleUrl: './driver-form.scss'
})
export class DriverForm {
  driver: Driver = {
    nombre: '',
    apellido: '',
    licencia: '',
    telefono: '',
    estado: 'activo'
  };
  saving = false;
  error = '';

  constructor(private driverService: DriverService, private router: Router) {}

  save() {
    this.saving = true;
    this.driverService.create(this.driver).subscribe({
      next: () => this.router.navigate(['/drivers']),
      error: () => { this.error = 'Error al guardar el conductor'; this.saving = false; }
    });
  }
}