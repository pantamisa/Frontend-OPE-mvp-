import { Injectable } from '@angular/core';
import { ApiService } from './api';

export interface Vehicle {
  id?: number;
  placa: string;
  marca: string;
  modelo: string;
  anio: number;
  estado: 'disponible' | 'rentado' | 'mantenimiento';
}

@Injectable({ providedIn: 'root' })
export class VehicleService {
  constructor(private api: ApiService) {}

  getAll() { return this.api.get<Vehicle[]>('vehicles'); }
  create(v: Vehicle) { return this.api.post<Vehicle>('vehicles', v); }
  update(id: number, v: Vehicle) { return this.api.patch<Vehicle>('vehicles', id, v); }
}