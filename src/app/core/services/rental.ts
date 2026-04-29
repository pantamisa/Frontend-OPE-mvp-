import { Injectable } from '@angular/core';
import { ApiService } from './api';

export interface Rental {
  id?: number;
  vehiculo: number;
  conductor: number;
  fecha_inicio: string;
  fecha_fin?: string;
  tipo_tarifa: 'hora' | 'dia' | 'km';
  estado: 'activa' | 'finalizada';
  total?: number;
}

@Injectable({ providedIn: 'root' })
export class RentalService {
  constructor(private api: ApiService) {}

  getAll() { return this.api.get<Rental[]>('contracts'); }
  getById(id: number) { return this.api.get<Rental>(`contracts/${id}`); }
  create(r: Rental) { return this.api.post<Rental>('contracts', r); }
  close(id: number) { return this.api.post<Rental>(`contracts/${id}/close`, {}); }
}