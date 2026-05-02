import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Driver {
  id: number;
  name: string;
  license: string;
  phone: string;
  email: string;
  status: 'Activo' | 'Inactivo';
  checked: boolean;
}

@Component({
  selector: 'app-driver-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './driver-register.component.html',
  styleUrls: ['./driver-register.component.scss']
})
export class DriverRegisterComponent {
  searchTerm = '';
  showModal = false;

  newDriver = { name: '', license: '', phone: '', email: '', status: 'Activo' as 'Activo' | 'Inactivo' };

  drivers: Driver[] = [
    { id: 1, name: 'Carlos Mendoza', license: 'B1-2938471', phone: '300 123 4567', email: 'carlos@flota.com', status: 'Activo', checked: false },
    { id: 2, name: 'Luisa Fernández', license: 'C1-1029384', phone: '315 987 6543', email: 'luisa@flota.com', status: 'Activo', checked: false },
    { id: 3, name: 'Andrés Ríos', license: 'B2-5647382', phone: '320 456 7890', email: 'andres@flota.com', status: 'Inactivo', checked: false },
  ];

  get filtered() {
    const q = this.searchTerm.toLowerCase();
    return this.drivers.filter(d =>
      d.name.toLowerCase().includes(q) || d.license.toLowerCase().includes(q)
    );
  }

  openModal() { this.showModal = true; this.newDriver = { name: '', license: '', phone: '', email: '', status: 'Activo' }; }
  closeModal() { this.showModal = false; }

  saveDriver() {
    if (!this.newDriver.name.trim()) return;
    this.drivers.push({ id: Date.now(), ...this.newDriver, checked: false });
    this.closeModal();
  }

  deleteSelected() { this.drivers = this.drivers.filter(d => !d.checked); }
}
