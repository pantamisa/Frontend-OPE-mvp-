import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DriverService, Driver } from '../../../core/services/driver';

@Component({
  selector: 'app-driver-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './driver-list.html',
  styleUrl: './driver-list.scss'
})
export class DriverList implements OnInit {
  drivers: Driver[] = [];
  loading = true;
  error = '';

  constructor(private driverService: DriverService) {}

  ngOnInit() {
    this.driverService.getAll().subscribe({
      next: (data) => { this.drivers = data; this.loading = false; },
      error: () => { this.error = 'Error al cargar conductores'; this.loading = false; }
    });
  }
}