import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../shared/api/api-response';
import { CuentaResponse } from '../../models/interfaces/response/cuenta.response';
import { CrearCuentaRequest } from '../../models/interfaces/request/crear-cuenta.request';
import { TransferenciaRequest } from '../../models/interfaces/request/transferencia.request';
import { ComprobanteResponse } from '../../models/interfaces/response/comprobante.response';
import { DetalleCuenta } from '../../models/dtos/account-detail.interface';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/cuentas';

  getAccountsByDni(dni: string): Observable<ApiResponse<CuentaResponse[]>> {
    return this.http.get<ApiResponse<CuentaResponse[]>>(`${this.apiUrl}/cliente/${dni}/listar`);
  }

  createAccount(dni: string, request: CrearCuentaRequest): Observable<ApiResponse<CuentaResponse>> {
    return this.http.post<ApiResponse<CuentaResponse>>(
      `${this.apiUrl}/usuario/${dni}/crear`,
      request
    );
  }
  initiateTransfer(
    idCuentaOrigen: number,
    request: TransferenciaRequest
  ): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.apiUrl}/${idCuentaOrigen}/transferir`, request);
  }

  confirmTransfer(dni: string, codigoOTP: string): Observable<ApiResponse<ComprobanteResponse>> {
    return this.http.post<ApiResponse<ComprobanteResponse>>(
      `${this.apiUrl}/confirmar-transferencia?dni=${dni}&codigoOTP=${codigoOTP}`,
      {}
    );
  }
  getAccountDetail(idCuenta: number): Observable<ApiResponse<DetalleCuenta>> {
    return this.http.get<ApiResponse<DetalleCuenta>>(`${this.apiUrl}/${idCuenta}`);
  }
}
