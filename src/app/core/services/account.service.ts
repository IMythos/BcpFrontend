import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../shared/api/api-response';
import { CuentaResponse } from '../../models/interfaces/response/cuenta.response';
import { CrearCuentaRequest } from '../../models/interfaces/request/crear-cuenta.request';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/cuentas';

  getAccountsByDni(dni: string): Observable<ApiResponse<CuentaResponse[]>> {
    return this.http.get<ApiResponse<CuentaResponse[]>>(`${this.apiUrl}/cliente/${dni}/listar`);
  }

  createAccount(dni: string, request: CrearCuentaRequest): Observable<ApiResponse<CuentaResponse>> {
    return this.http.post<ApiResponse<CuentaResponse>>(`${this.apiUrl}/usuario/${dni}/crear`, request);
  }
}