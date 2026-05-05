export interface Contract {
  id: number;
  numero_contrato: string;
  tipo_tarifa: string;
  tarifa_valor: string | number;
  km_inicial: string | number;
  km_final: string | number | null;
  fecha_inicio: string;
  fecha_fin: string | null;
  costo_subtotal?: string | number;
  costo_penalizaciones?: string | number;
  costo_total?: string | number;
  estado: string;
  observaciones: string;
  created_at?: string;
  updated_at?: string;
  vehiculo: number;
  conductor: number;
  creado_por?: number;
  checked?: boolean;
}
