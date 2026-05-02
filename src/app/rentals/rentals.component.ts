import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Rental {
  id: number;
  vehicle: string;
  driver: string;
  kmStart: number;
  kmEnd: number | null;
  costPerKm: number;
  total: number | null;
  status: 'Activa' | 'Finalizada';
  checked: boolean;
}

@Component({
  selector: 'app-rentals',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './rentals.component.html',
  styleUrls: ['./rentals.component.scss']
})
export class RentalsComponent {
  showModal = false;
  closingRental: Rental | null = null;
  kmFinal = 0;
  searchTerm = '';

  vehicles = ['Toyota Corolla - ABC-123', 'Ford Explorer - DEF-456', 'Chevrolet N300 - GHI-789'];
  drivers  = ['Carlos Mendoza', 'Luisa Fernández', 'Andrés Ríos'];

  newRental = { vehicle: '', driver: '', kmStart: 0, costPerKm: 0 };

  rentals: Rental[] = [
    { id: 1, vehicle: 'Toyota Corolla - ABC-123', driver: 'Carlos Mendoza', kmStart: 12000, kmEnd: 12350, costPerKm: 500, total: 175000, status: 'Finalizada', checked: false },
    { id: 2, vehicle: 'Ford Explorer - DEF-456', driver: 'Luisa Fernández', kmStart: 45200, kmEnd: null, costPerKm: 800, total: null, status: 'Activa', checked: false },
  ];

  get filtered() {
    const q = this.searchTerm.toLowerCase();
    return this.rentals.filter(r => r.vehicle.toLowerCase().includes(q) || r.driver.toLowerCase().includes(q));
  }

  openModal() {
    this.showModal = true;
    this.newRental = { vehicle: this.vehicles[0], driver: this.drivers[0], kmStart: 0, costPerKm: 0 };
  }
  closeModal() { this.showModal = false; }

  saveRental() {
    if (!this.newRental.vehicle || this.newRental.kmStart < 0) return;
    this.rentals.push({
      id: Date.now(),
      ...this.newRental,
      kmEnd: null, total: null, status: 'Activa', checked: false
    });
    this.closeModal();
  }

  openClose(r: Rental) { this.closingRental = r; this.kmFinal = r.kmStart + 1; }
  cancelClose() { this.closingRental = null; }

  finalizeRental() {
    if (!this.closingRental) return;
    const km = this.kmFinal - this.closingRental.kmStart;
    this.closingRental.kmEnd = this.kmFinal;
    this.closingRental.total = km * this.closingRental.costPerKm;
    this.closingRental.status = 'Finalizada';
    this.closingRental = null;
  }

  get closingKm() {
    if (!this.closingRental) return 0;
    return Math.max(0, this.kmFinal - this.closingRental.kmStart);
  }

  get closingTotal() {
    if (!this.closingRental) return 0;
    return this.closingKm * this.closingRental.costPerKm;
  }

  deleteSelected() { this.rentals = this.rentals.filter(r => !r.checked); }
}
