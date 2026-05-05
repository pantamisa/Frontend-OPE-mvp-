import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Vehicle } from '../core/models/vehicle.model';
import { Driver } from '../core/models/driver.model';
import { NotificationService } from '../core/services/notification.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-vehicle-register',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './vehicle-register.component.html',
  styleUrls: ['./vehicle-register.component.scss']
})
export class VehicleRegisterComponent implements OnInit {
  searchTerm = '';
  showModal = false;
  showAssignModal = false;
  isEditing = false;
  currentVehicleId: number | null = null;

  // Pagination
  currentPage = 1;
  itemsPerPage = 10;

  vehicles: Vehicle[] = [];
  drivers: Driver[] = [];

  // Options for form
  brands = ['Toyota', 'Ford', 'Chevrolet', 'Hyundai', 'Kia', 'Mazda', 'Nissan', 'Volkswagen', 'Renault', 'Suzuki'];
  allModels: { [key: string]: string[] } = {
    'Toyota': ['Corolla', 'Hilux', 'Rav4', 'Yaris', 'Prado'],
    'Ford': ['Explorer', 'Ranger', 'F-150', 'Fiesta', 'EcoSport'],
    'Chevrolet': ['Onix', 'Tracker', 'N300', 'Captiva', 'Colorado'],
    'Hyundai': ['Accent', 'Tucson', 'Santa Fe', 'Creta', 'HB20'],
    'Kia': ['Picanto', 'Sportage', 'Rio', 'Cerato', 'Seltos'],
    'Mazda': ['Mazda 3', 'CX-5', 'CX-30', 'BT-50', 'CX-9'],
    'Nissan': ['Versa', 'Frontier', 'Qashqai', 'Sentra', 'Kicks'],
    'Volkswagen': ['Gol', 'Amarok', 'T-Cross', 'Jetta', 'Tiguan'],
    'Renault': ['Duster', 'Kwid', 'Stepway', 'Logan', 'Sandero'],
    'Suzuki': ['Swift', 'Vitara', 'Jimny', 'S-Presso', 'Ertiga']
  };
  models: string[] = [];

  vehicleTypes = [
    { label: 'Sedán', value: 'Sedán' },
    { label: 'SUV', value: 'SUV' },
    { label: 'Camioneta', value: 'Camioneta' },
    { label: 'Furgoneta', value: 'Furgoneta' },
    { label: 'Camión', value: 'Camión' },
    { label: 'Moto', value: 'Moto' }
  ];

  statusOptions = [
    { label: 'Disponible', value: 'Disponible' },
    { label: 'En renta', value: 'En renta' },
    { label: 'Mantenimiento', value: 'Mantenimiento' }
  ];

  colorOptions = [
    { label: 'Blanco', value: 'Blanco' },
    { label: 'Negro', value: 'Negro' },
    { label: 'Gris', value: 'Gris' },
    { label: 'Rojo', value: 'Rojo' },
    { label: 'Azul', value: 'Azul' },
    { label: 'Plateado', value: 'Plateado' }
  ];

  newVehicle = {
    plate: '',
    brand: '',
    model: '',
    year: new Date().getFullYear(),
    type: 'Sedán',
    status: 'Disponible',
    km_per_liter: 12,
    capacidad: 5,
    color: 'Blanco'
  };

  assignment = {
    conductor: 0,
    numero_contrato: '',
    tipo_tarifa: 'dia',
    tarifa_valor: '150000',
    km_inicial: '0',
    observaciones: ''
  };

  constructor(
    private http: HttpClient,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.loadVehicles();
    this.loadDrivers();
  }

  loadVehicles(): void {
    this.http.get<Vehicle[]>('http://localhost:8000/api/vehicles/').subscribe({
      next: (res) => this.vehicles = res.map(v => ({ ...v, checked: false })),
      error: (err) => console.error('Error loading vehicles', err)
    });
  }

  loadDrivers(): void {
    this.http.get<Driver[]>('http://localhost:8000/api/drivers/').subscribe({
      next: (res) => this.drivers = res.filter(d => d.estado.toLowerCase() === 'activo'),
      error: (err) => console.error('Error loading drivers', err)
    });
  }

  onBrandChange() {
    this.models = this.allModels[this.newVehicle.brand] || [];
    if (!this.models.includes(this.newVehicle.model)) {
      this.newVehicle.model = '';
    }
  }

  openModal() {
    this.isEditing = false;
    this.currentVehicleId = null;
    this.showModal = true;
    this.newVehicle = {
      plate: '',
      brand: '',
      model: '',
      year: new Date().getFullYear(),
      type: 'Sedán',
      status: 'Disponible',
      km_per_liter: 12,
      capacidad: 5,
      color: 'Blanco'
    };
    this.models = [];
  }

  editVehicle(v: Vehicle) {
    this.isEditing = true;
    this.currentVehicleId = v.id;
    this.newVehicle = {
      plate: v.plate,
      brand: v.brand,
      model: v.model,
      year: v.year,
      type: v.type,
      status: v.status,
      km_per_liter: v.km_per_liter,
      capacidad: v.capacidad || 5,
      color: v.color || 'Blanco'
    };
    this.onBrandChange();
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.showAssignModal = false;
  }

  saveVehicle() {
    if (!this.newVehicle.plate || !this.newVehicle.brand || !this.newVehicle.model) {
      this.notificationService.show('warning', 'Por favor, completa los campos obligatorios.');
      return;
    }

    const request = this.isEditing && this.currentVehicleId ?
      this.http.put(`http://localhost:8000/api/vehicles/${this.currentVehicleId}/`, this.newVehicle) :
      this.http.post('http://localhost:8000/api/vehicles/', this.newVehicle);

    request.subscribe({
      next: () => {
        this.notificationService.success(`Vehículo ${this.isEditing ? 'actualizado' : 'registrado'} con éxito.`);
        this.loadVehicles();
        this.closeModal();
      },
      error: (err) => console.error('Error saving vehicle', err)
    });
  }

  // --- Assignment Workflow ---
  openAssignModal(v: Vehicle) {
    this.currentVehicleId = v.id;
    this.assignment = {
      conductor: 0,
      numero_contrato: `CONT-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      tipo_tarifa: 'dia',
      tarifa_valor: '150000',
      km_inicial: '0',
      observaciones: `Asignación de vehículo ${v.plate}`
    };
    this.showAssignModal = true;
  }

  saveAssignment() {
    if (this.assignment.conductor === 0) {
      this.notificationService.show('warning', 'Selecciona un conductor.');
      return;
    }

    const payload = {
      ...this.assignment,
      vehiculo: this.currentVehicleId,
      fecha_inicio: new Date().toISOString()
    };

    this.http.post('http://localhost:8000/api/contracts/', payload).subscribe({
      next: () => {
        this.notificationService.success('Conductor asignado y contrato creado.');
        this.loadVehicles();
        this.closeModal();
      },
      error: (err) => console.error('Error saving assignment', err)
    });
  }

  // --- Deletion ---
  deleteSingle(id: number) {
    if (confirm('¿Estás seguro de eliminar este vehículo?')) {
      this.http.delete(`http://localhost:8000/api/vehicles/${id}/`).subscribe({
        next: () => { this.notificationService.success('Vehículo eliminado.'); this.loadVehicles(); },
        error: (err) => console.error('Error deleting vehicle', err)
      });
    }
  }

  deleteSelected() { 
    const selected = this.vehicles.filter(v => v.checked);
    if (selected.length === 0) return;
    if (confirm(`¿Estás seguro de eliminar ${selected.length} vehículo(s)?`)) {
      forkJoin(selected.map(v => this.http.delete(`http://localhost:8000/api/vehicles/${v.id}/`))).subscribe({
        next: () => { this.notificationService.success('Vehículos eliminados.'); this.loadVehicles(); },
        error: (err) => {
          console.error('Error deleting vehicles', err);
          this.loadVehicles();
        }
      });
    }
  }

  // --- UI Helpers ---
  get filteredVehicles() {
    const q = this.searchTerm.toLowerCase();
    return this.vehicles.filter(v =>
      v.plate.toLowerCase().includes(q) || v.brand.toLowerCase().includes(q) || 
      v.model.toLowerCase().includes(q) || (v.assigned_driver_name && v.assigned_driver_name.toLowerCase().includes(q))
    );
  }
  get paginatedVehicles() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredVehicles.slice(startIndex, startIndex + this.itemsPerPage);
  }
  get totalPages() { return Math.ceil(this.filteredVehicles.length / this.itemsPerPage); }
  get pageNumbers() { return Array.from({ length: this.totalPages }, (_, i) => i + 1); }
  changePage(page: number) { if (page >= 1 && page <= this.totalPages) this.currentPage = page; }
  onSearchChange() { this.currentPage = 1; }
  statusClass(s: string) {
    const status = (s || '').toLowerCase();
    if (status.includes('disponible')) return 'badge--green';
    if (status.includes('renta')) return 'badge--blue';
    return 'badge--orange';
  }
}
