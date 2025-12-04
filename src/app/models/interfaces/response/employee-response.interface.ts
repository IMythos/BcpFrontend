import { UserResponseData } from "./user-response.interface";

export interface EmployeeResponseData {
  idEmpleado: number;
  fechaContratacion: string;
  salario: number;
  idUsuario: UserResponseData
}
