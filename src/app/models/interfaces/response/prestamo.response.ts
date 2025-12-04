export interface PrestamoResponse {
  id: number;
  usuarioId: number;
  monto: number;
  plazoMeses: number;
  interes: number;
  estado: string;
}