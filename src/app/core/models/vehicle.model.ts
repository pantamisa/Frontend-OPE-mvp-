export interface Vehicle {
  id: number;
  plate: string;
  brand: string;
  model: string;
  year: number;
  type: string;
  status: string;
  km_per_liter: number;
  assigned_driver_name: string | null;
  capacidad?: number;
  color?: string;
  checked?: boolean;
}
