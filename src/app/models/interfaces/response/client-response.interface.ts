import { UserResponseData } from "./user-response.interface";

export interface ClientResponseData {
  idCliente: number;
  fechaRegistro: string;
  idUsuario: UserResponseData;
}
