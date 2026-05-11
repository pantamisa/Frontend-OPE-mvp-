import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Driver } from '../core/models/driver.model';
import { NotificationService } from '../core/services/notification.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-driver-register',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './driver-register.component.html',
  styleUrls: ['./driver-register.component.scss']
})
export class DriverRegisterComponent implements OnInit {
  searchTerm = '';
  showModal = false;
  isEditing = false;
  currentDriverId: number | null = null;

  // Pagination
  currentPage = 1;
  itemsPerPage = 10;

  drivers: Driver[] = [];

  // Options
  statusOptions = [
    { label: 'Activo', value: 'activo' },
    { label: 'Inactivo', value: 'inactivo' }
  ];

  licenseCategories = ['A1', 'A2', 'B1', 'B2', 'B3', 'C1', 'C2', 'C3'];

  newDriver: {
    cedula: string;
    nombre: string;
    apellido: string;
    num_licencia: string;
    categoria_licencia: string;
    fecha_venc_licencia: string;
    telefono: string;
    email: string;
    estado: string;
    limite_horas_dia: number;
    user: number | null;
  } = {
    cedula: '',
    nombre: '',
    apellido: '',
    num_licencia: '',
    categoria_licencia: 'B1',
    fecha_venc_licencia: new Date().toISOString().split('T')[0],
    telefono: '',
    email: '',
    estado: 'activo',
    limite_horas_dia: 8,
    user: 1 // Default user id or handled by backend
  };

  constructor(
    private http: HttpClient,
    private notificationService: NotificationService
  ) { }

  ngOnInit(): void {
    this.loadDrivers();
  }

  loadDrivers(): void {
    this.http.get<Driver[]>('http://localhost:8000/api/drivers/').subscribe({
      next: (res) => {
        this.drivers = res.map(d => ({ ...d, checked: false }));
      },
      error: (err) => console.error('Error loading drivers', err)
    });
  }

  // --- CRUD Operations ---
  openModal() {
    this.isEditing = false;
    this.currentDriverId = null;
    this.showModal = true;
    this.newDriver = {
      cedula: '',
      nombre: '',
      apellido: '',
      num_licencia: '',
      categoria_licencia: 'B1',
      fecha_venc_licencia: new Date().toISOString().split('T')[0],
      telefono: '',
      email: '',
      estado: 'activo',
      limite_horas_dia: 8,
      user: null
    };
  }

  editDriver(d: Driver) {
    this.isEditing = true;
    this.currentDriverId = d.id;
    this.newDriver = {
      cedula: d.cedula,
      nombre: d.nombre,
      apellido: d.apellido,
      num_licencia: d.num_licencia,
      categoria_licencia: d.categoria_licencia,
      fecha_venc_licencia: d.fecha_venc_licencia,
      telefono: d.telefono,
      email: d.email,
      estado: d.estado.toLowerCase(),
      limite_horas_dia: Number(d.limite_horas_dia) || 8,
      user: d.user || null
    };
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  saveDriver() {
    if (!this.newDriver.cedula || !this.newDriver.nombre || !this.newDriver.num_licencia) {
      this.notificationService.show('warning', 'Por favor, completa los campos obligatorios.');
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { user, ...driverDataToSend } = this.newDriver;

    if (this.isEditing && this.currentDriverId) {
      this.http.put(`http://localhost:8000/api/drivers/${this.currentDriverId}/`, driverDataToSend).subscribe({
        next: () => {
          this.notificationService.success('¡Conductor actualizado con éxito!');
          this.loadDrivers();
          this.closeModal();
        },
        error: (err) => console.error('Error updating driver', err)
      });
    } else {
      this.http.post('http://localhost:8000/api/drivers/', driverDataToSend).subscribe({
        next: () => {
          this.notificationService.success('¡Conductor registrado con éxito!');
          this.loadDrivers();
          this.closeModal();
        },
        error: (err) => {
          console.error('Error saving driver', err);
          if (err.error && err.error.user && err.error.user.includes('Ya existe')) {
            this.notificationService.error('Error: Ya existe un conductor asociado a este usuario. Por favor, verifica tu cuenta o contacta al administrador.');
          } else {
            this.notificationService.error('Error al guardar el conductor.');
          }
        }
      });
    }
  }

  deleteSingle(id: number) {
    if (confirm('¿Estás seguro de eliminar este conductor?')) {
      this.http.delete(`http://localhost:8000/api/drivers/${id}/`).subscribe({
        next: () => {
          this.notificationService.success('Conductor eliminado.');
          this.loadDrivers();
        },
        error: (err) => console.error('Error deleting driver', err)
      });
    }
  }

  deleteSelected() {
    const selected = this.drivers.filter(d => d.checked);
    if (selected.length === 0) return;

    if (confirm(`¿Estás seguro de eliminar ${selected.length} conductor(es)?`)) {
      const deleteRequests = selected.map(d =>
        this.http.delete(`http://localhost:8000/api/drivers/${d.id}/`)
      );

      forkJoin(deleteRequests).subscribe({
        next: () => {
          this.notificationService.success('Conductores eliminados con éxito.');
          this.loadDrivers();
        },
        error: (err) => {
          console.error('Error deleting drivers', err);
          this.loadDrivers();
        }
      });
    }
  }

  // --- UI & Pagination ---
  get filteredDrivers() {
    const q = this.searchTerm.toLowerCase();
    return this.drivers.filter(d =>
      d.nombre.toLowerCase().includes(q) ||
      d.apellido.toLowerCase().includes(q) ||
      d.cedula.toLowerCase().includes(q) ||
      d.num_licencia.toLowerCase().includes(q)
    );
  }

  get paginatedDrivers() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredDrivers.slice(startIndex, startIndex + this.itemsPerPage);
  }

  get totalPages() {
    return Math.ceil(this.filteredDrivers.length / this.itemsPerPage);
  }

  get pageNumbers() {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  onSearchChange() {
    this.currentPage = 1;
  }

  statusClass(s: string) {
    return s.toLowerCase() === 'activo' ? 'badge--green' : 'badge--gray';
  }
}
