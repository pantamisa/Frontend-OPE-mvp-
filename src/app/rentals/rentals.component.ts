import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Contract } from '../core/models/contract.model';
import { Vehicle } from '../core/models/vehicle.model';
import { Driver } from '../core/models/driver.model';
import { NotificationService } from '../core/services/notification.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-rentals',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './rentals.component.html',
  styleUrls: ['./rentals.component.scss']
})
export class RentalsComponent implements OnInit {
  searchTerm = '';
  showModal = false;
  showFinalizeModal = false;
  isEditing = false;
  currentContractId: number | null = null;

  // Pagination
  currentPage = 1;
  itemsPerPage = 10;

  contracts: Contract[] = [];
  vehicles: Vehicle[] = [];
  drivers: Driver[] = [];

  // Options
  tariffTypes = [
    { label: 'Por Hora', value: 'hora' },
    { label: 'Por Día', value: 'dia' },
    { label: 'Por Kilómetro', value: 'km' }
  ];

  newContract = {
    numero_contrato: '',
    tipo_tarifa: 'dia',
    tarifa_valor: 150000,
    km_inicial: 0,
    km_final: null as number | null,
    fecha_inicio: new Date().toISOString(),
    fecha_fin: null as string | null,
    costo_penalizaciones: 0,
    observaciones: '',
    vehiculo: 0,
    conductor: 0
  };

  finalizeData = {
    km_final: 0,
    fecha_fin: new Date().toISOString(),
    costo_penalizaciones: 0,
    observaciones: 'Cierre de contrato'
  };

  constructor(
    private http: HttpClient,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.loadContracts();
    this.loadVehicles();
    this.loadDrivers();
  }

  loadContracts(): void {
    this.http.get<Contract[]>('http://localhost:8000/api/contracts/').subscribe({
      next: (res) => this.contracts = res.map(c => ({ ...c, checked: false })),
      error: (err) => console.error('Error loading contracts', err)
    });
  }

  loadVehicles(): void {
    this.http.get<Vehicle[]>('http://localhost:8000/api/vehicles/').subscribe({
      next: (res) => this.vehicles = res,
      error: (err) => console.error('Error loading vehicles', err)
    });
  }

  loadDrivers(): void {
    this.http.get<Driver[]>('http://localhost:8000/api/drivers/').subscribe({
      next: (res) => this.drivers = res,
      error: (err) => console.error('Error loading drivers', err)
    });
  }

  // --- CRUD Operations ---
  openModal() {
    this.isEditing = false;
    this.currentContractId = null;
    this.showModal = true;
    this.newContract = {
      numero_contrato: `CONT-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      tipo_tarifa: 'dia',
      tarifa_valor: 150000,
      km_inicial: 0,
      km_final: null,
      fecha_inicio: new Date().toISOString().slice(0, 16),
      fecha_fin: null,
      costo_penalizaciones: 0,
      observaciones: '',
      vehiculo: this.vehicles.length > 0 ? this.vehicles[0].id : 0,
      conductor: this.drivers.length > 0 ? this.drivers[0].id : 0
    };
  }

  editContract(c: Contract) {
    this.isEditing = true;
    this.currentContractId = c.id;
    this.newContract = {
      numero_contrato: c.numero_contrato,
      tipo_tarifa: c.tipo_tarifa,
      tarifa_valor: Number(c.tarifa_valor),
      km_inicial: Number(c.km_inicial),
      km_final: c.km_final ? Number(c.km_final) : null,
      fecha_inicio: c.fecha_inicio.slice(0, 16),
      fecha_fin: c.fecha_fin ? c.fecha_fin.slice(0, 16) : null,
      costo_penalizaciones: Number(c.costo_penalizaciones || 0),
      observaciones: c.observaciones,
      vehiculo: c.vehiculo,
      conductor: c.conductor
    };
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.showFinalizeModal = false;
  }

  saveContract() {
    if (!this.newContract.vehiculo || !this.newContract.conductor || !this.newContract.numero_contrato) {
      this.notificationService.show('warning', 'Por favor, completa los campos obligatorios.');
      return;
    }

    const request = this.isEditing && this.currentContractId ?
      this.http.put(`http://localhost:8000/api/contracts/${this.currentContractId}/`, this.newContract) :
      this.http.post('http://localhost:8000/api/contracts/', this.newContract);

    request.subscribe({
      next: () => {
        this.notificationService.success(`Contrato ${this.isEditing ? 'actualizado' : 'creado'} con éxito.`);
        this.loadContracts();
        this.closeModal();
      },
      error: (err) => console.error('Error saving contract', err)
    });
  }

  // --- Finalize Workflow ---
  openFinalize(c: Contract) {
    this.currentContractId = c.id;
    this.finalizeData = {
      km_final: Number(c.km_inicial) + 10,
      fecha_fin: new Date().toISOString().slice(0, 16),
      costo_penalizaciones: 0,
      observaciones: 'Finalización de contrato estándar'
    };
    this.showFinalizeModal = true;
  }

  confirmFinalize() {
    this.http.patch(`http://localhost:8000/api/contracts/${this.currentContractId}/finalizar/`, this.finalizeData).subscribe({
      next: () => {
        this.notificationService.success('¡Contrato finalizado con éxito!');
        this.loadContracts();
        this.closeModal();
      },
      error: (err) => console.error('Error finalizing contract', err)
    });
  }

  deleteSingle(id: number) {
    if (confirm('¿Estás seguro de eliminar este contrato?')) {
      this.http.delete(`http://localhost:8000/api/contracts/${id}/`).subscribe({
        next: () => {
          this.notificationService.success('Contrato eliminado.');
          this.loadContracts();
        },
        error: (err) => console.error('Error deleting contract', err)
      });
    }
  }

  deleteSelected() {
    const selected = this.contracts.filter(c => c.checked);
    if (selected.length === 0) return;
    if (confirm(`¿Estás seguro de eliminar ${selected.length} contrato(s)?`)) {
      const deleteRequests = selected.map(c => this.http.delete(`http://localhost:8000/api/contracts/${c.id}/`));
      forkJoin(deleteRequests).subscribe({
        next: () => { this.notificationService.success('Contratos eliminados.'); this.loadContracts(); },
        error: (err) => {
          console.error('Error deleting multiple contracts', err);
          this.loadContracts();
        }
      });
    }
  }

  // --- Helpers ---
  get filteredContracts() {
    const q = this.searchTerm.toLowerCase();
    return this.contracts.filter(c =>
      c.numero_contrato.toLowerCase().includes(q) ||
      this.getVehiclePlate(c.vehiculo).toLowerCase().includes(q) ||
      this.getDriverName(c.conductor).toLowerCase().includes(q)
    );
  }

  get paginatedContracts() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredContracts.slice(startIndex, startIndex + this.itemsPerPage);
  }

  get totalPages() { return Math.ceil(this.filteredContracts.length / this.itemsPerPage); }
  get pageNumbers() { return Array.from({ length: this.totalPages }, (_, i) => i + 1); }
  changePage(page: number) { if (page >= 1 && page <= this.totalPages) this.currentPage = page; }
  onSearchChange() { this.currentPage = 1; }

  getVehiclePlate(id: number): string {
    const v = this.vehicles.find(v => v.id === id);
    return v ? v.plate : '---';
  }

  getDriverName(id: number): string {
    const d = this.drivers.find(d => d.id === id);
    return d ? `${d.nombre} ${d.apellido}` : '---';
  }

  statusClass(s: string) {
    const status = s.toLowerCase();
    if (status === 'activa' || status === 'activo') return 'badge--green';
    if (status === 'finalizada' || status === 'completado') return 'badge--gray';
    return 'badge--orange';
  }
}
