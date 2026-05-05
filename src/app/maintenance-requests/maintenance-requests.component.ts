import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Maintenance } from '../core/models/maintenance.model';
import { Vehicle } from '../core/models/vehicle.model';
import { NotificationService } from '../core/services/notification.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-maintenance-requests',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './maintenance-requests.component.html',
  styleUrls: ['./maintenance-requests.component.scss']
})
export class MaintenanceRequestsComponent implements OnInit {
  searchTerm = '';
  showModal = false;
  isEditing = false;
  currentMaintenanceId: number | null = null;

  // Pagination
  currentPage = 1;
  itemsPerPage = 10;

  maintenances: Maintenance[] = [];
  vehicles: Vehicle[] = [];

  // Options
  types = [
    { label: 'Preventivo', value: 'preventivo' },
    { label: 'Correctivo', value: 'correctivo' }
  ];

  states = [
    { label: 'Programado', value: 'programado' },
    { label: 'En Progreso', value: 'en_progreso' },
    { label: 'Completado', value: 'completado' }
  ];

  newRequest = {
    tipo: 'preventivo',
    descripcion: '',
    fecha: new Date().toISOString().split('T')[0],
    km_al_momento: 0,
    costo: 0,
    vehiculo: 0,
    estado: 'programado'
  };

  constructor(
    private http: HttpClient,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.loadMaintenances();
    this.loadVehicles();
  }

  loadMaintenances(): void {
    this.http.get<Maintenance[]>('http://localhost:8000/api/maintenance/').subscribe({
      next: (res) => {
        this.maintenances = res.map(m => ({ ...m, checked: false }));
      },
      error: (err) => console.error('Error loading maintenance', err)
    });
  }

  loadVehicles(): void {
    this.http.get<Vehicle[]>('http://localhost:8000/api/vehicles/').subscribe({
      next: (res) => this.vehicles = res,
      error: (err) => console.error('Error loading vehicles', err)
    });
  }

  // --- CRUD Operations ---
  openModal() {
    this.isEditing = false;
    this.currentMaintenanceId = null;
    this.showModal = true;
    this.newRequest = {
      tipo: 'preventivo',
      descripcion: '',
      fecha: new Date().toISOString().split('T')[0],
      km_al_momento: 0,
      costo: 0,
      vehiculo: this.vehicles.length > 0 ? this.vehicles[0].id : 0,
      estado: 'programado'
    };
  }

  editMaintenance(m: Maintenance) {
    this.isEditing = true;
    this.currentMaintenanceId = m.id;
    this.newRequest = {
      tipo: m.tipo,
      descripcion: m.descripcion,
      fecha: m.fecha,
      km_al_momento: Number(m.km_al_momento),
      costo: Number(m.costo),
      vehiculo: m.vehiculo,
      estado: m.estado
    };
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  saveMaintenance() {
    if (!this.newRequest.vehiculo || !this.newRequest.descripcion) {
      this.notificationService.show('warning', 'Por favor, completa los campos obligatorios.');
      return;
    }

    const request = this.isEditing && this.currentMaintenanceId ?
      this.http.put(`http://localhost:8000/api/maintenance/${this.currentMaintenanceId}/`, this.newRequest) :
      this.http.post('http://localhost:8000/api/maintenance/', this.newRequest);

    request.subscribe({
      next: () => {
        this.notificationService.success(`Mantenimiento ${this.isEditing ? 'actualizado' : 'registrado'} con éxito.`);
        this.loadMaintenances();
        this.closeModal();
      },
      error: (err) => console.error('Error saving maintenance', err)
    });
  }

  deleteSingle(id: number) {
    if (confirm('¿Estás seguro de eliminar este registro?')) {
      this.http.delete(`http://localhost:8000/api/maintenance/${id}/`).subscribe({
        next: () => {
          this.notificationService.success('Registro eliminado.');
          this.loadMaintenances();
        },
        error: (err) => console.error('Error deleting maintenance record', err)
      });
    }
  }

  deleteSelected() {
    const selected = this.maintenances.filter(m => m.checked);
    if (selected.length === 0) return;

    if (confirm(`¿Estás seguro de eliminar ${selected.length} registro(s)?`)) {
      const deleteRequests = selected.map(m => this.http.delete(`http://localhost:8000/api/maintenance/${m.id}/`));
      forkJoin(deleteRequests).subscribe({
        next: () => {
          this.notificationService.success('Registros eliminados con éxito.');
          this.loadMaintenances();
        },
        error: (err) => {
          console.error('Error deleting multiple maintenance records', err);
          this.loadMaintenances();
        }
      });
    }
  }

  // --- UI Helpers ---
  get filteredMaintenances() {
    const q = this.searchTerm.toLowerCase();
    return this.maintenances.filter(m =>
      m.descripcion.toLowerCase().includes(q) ||
      m.tipo.toLowerCase().includes(q) ||
      this.getVehiclePlate(m.vehiculo).toLowerCase().includes(q)
    );
  }

  get paginatedMaintenances() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredMaintenances.slice(startIndex, startIndex + this.itemsPerPage);
  }

  get totalPages() { return Math.ceil(this.filteredMaintenances.length / this.itemsPerPage); }
  get pageNumbers() { return Array.from({ length: this.totalPages }, (_, i) => i + 1); }
  changePage(page: number) { if (page >= 1 && page <= this.totalPages) this.currentPage = page; }
  onSearchChange() { this.currentPage = 1; }

  getVehiclePlate(id: number): string {
    const v = this.vehicles.find(v => v.id === id);
    return v ? v.plate : '---';
  }

  statusClass(s: string) {
    const status = s.toLowerCase();
    if (status === 'completado') return 'badge--green';
    if (status === 'en_progreso') return 'badge--blue';
    return 'badge--orange';
  }
}
