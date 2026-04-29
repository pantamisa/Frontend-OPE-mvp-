import { Injectable } from '@angular/core';
import { ApiService } from './api';

export interface Driver {
  id?: number;
  nombre: string;
  apellido: string;
  licencia: string;
  telefono: string;
  estado: 'activo' | 'inactivo';
}

@Injectable({ providedIn: 'root' })
export class DriverService {
  constructor(private api: ApiService) {}

  getAll() { return this.api.get<Driver[]>('drivers'); }
  create(d: Driver) { return this.api.post<Driver>('drivers', d); }
}