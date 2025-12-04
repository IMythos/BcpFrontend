import { DetalleCuenta } from "./account-detail.interface";
import { PagoPendiente } from "./pago-pendiente.interface";
import { UserInfo } from "./user-info";

export interface LoadClientDataDTO {
  informacionUsuario: UserInfo;
  cuentas: DetalleCuenta[];
  pagosPendientes: PagoPendiente[];
}
