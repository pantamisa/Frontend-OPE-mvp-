export interface Driver {
  id: number;
  cedula: string;
  nombre: string;
  apellido: string;
  num_licencia: string;
  categoria_licencia: string;
  fecha_venc_licencia: string;
  telefono: string;
  email: string;
  estado: string;
  horas_hoy?: string;
  horas_totales?: string;
  limite_horas_dia?: string;
  fecha_registro?: string;
  updated_at?: string;
  user?: number;
  checked?: boolean;
}
