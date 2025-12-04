export interface Movimiento {
  id: number;
  fecha: string;
  monto: number;
  tipo: 'DEBITO' | 'CREDITO' | string;
}
