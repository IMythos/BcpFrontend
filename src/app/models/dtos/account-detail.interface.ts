import { Movimiento } from "./movimiento.interface";

export interface DetalleCuenta {
  idCuenta: number;
  tipo: 'AHORROS' | 'CORRIENTE' | string;
  saldo: number;
  movimientos: Movimiento[];
}
