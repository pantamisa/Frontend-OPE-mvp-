export interface Maintenance {
  id: number;
  tipo: string;
  descripcion: string;
  fecha: string;
  km_al_momento: string | number;
  costo: string | number;
  proximo_km?: string | number;
  proximo_fecha?: string;
  estado: string;
  created_at?: string;
  updated_at?: string;
  vehiculo: number;
  tecnico?: number;
  checked?: boolean;
}
