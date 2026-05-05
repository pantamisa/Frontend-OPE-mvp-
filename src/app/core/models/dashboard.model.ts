export interface DashboardData {
  labels: string[];
  data: number[];
  metrics: {
    consumoMes: number;
    promedioMes: number;
    promedioOficinas: number;
  };
  user: { 
    username: string; 
    first_name: string; 
  };
}
