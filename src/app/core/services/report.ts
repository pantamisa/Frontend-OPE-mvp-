import { Injectable } from '@angular/core';
import { ApiService } from './api';

export interface Report {
  total_ingresos: number;
  total_rentas: number;
  detalle: { mes: string; ingresos: number }[];
}

@Injectable({ providedIn: 'root' })
export class ReportService {
  constructor(private api: ApiService) {}

  getIncome() { return this.api.get<Report>('reports/income'); }
}