import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Vehicle {
  id: number;
  plate: string;
  brand: string;
  model: string;
  year: number;
  type: string;
  status: 'Disponible' | 'En renta' | 'Mantenimiento';
  kmPerLiter: number;
  checked: boolean;
}

@Component({
  selector: 'app-vehicle-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './vehicle-register.component.html',
  styleUrls: ['./vehicle-register.component.scss']
})
export class VehicleRegisterComponent {
  searchTerm = '';
  showModal = false;

  vehicleTypes = ['Sedán', 'SUV', 'Camioneta', 'Furgoneta', 'Camión', 'Moto'];
  statusOptions = ['Disponible', 'En renta', 'Mantenimiento'];

  newVehicle = { plate: '', brand: '', model: '', year: new Date().getFullYear(), type: 'Sedán', status: 'Disponible' as Vehicle['status'], kmPerLiter: 0 };

  vehicles: Vehicle[] = [
    { id: 1, plate: 'ABC-123', brand: 'Toyota', model: 'Corolla', year: 2021, type: 'Sedán', status: 'Disponible', kmPerLiter: 14, checked: false },
    { id: 2, plate: 'DEF-456', brand: 'Ford', model: 'Explorer', year: 2020, type: 'SUV', status: 'En renta', kmPerLiter: 10, checked: false },
    { id: 3, plate: 'GHI-789', brand: 'Chevrolet', model: 'N300', year: 2019, type: 'Furgoneta', status: 'Mantenimiento', kmPerLiter: 12, checked: false },
  ];

  get filtered() {
    const q = this.searchTerm.toLowerCase();
    return this.vehicles.filter(v =>
      v.plate.toLowerCase().includes(q) || v.brand.toLowerCase().includes(q) || v.model.toLowerCase().includes(q)
    );
  }

  openModal() { this.showModal = true; this.newVehicle = { plate: '', brand: '', model: '', year: new Date().getFullYear(), type: 'Sedán', status: 'Disponible', kmPerLiter: 0 }; }
  closeModal() { this.showModal = false; }

  saveVehicle() {
    if (!this.newVehicle.plate.trim()) return;
    this.vehicles.push({ id: Date.now(), ...this.newVehicle, checked: false });
    this.closeModal();
  }

  deleteSelected() { this.vehicles = this.vehicles.filter(v => !v.checked); }

  statusClass(s: string) {
    return s === 'Disponible' ? 'badge--green' : s === 'En renta' ? 'badge--blue' : 'badge--orange';
  }
}
