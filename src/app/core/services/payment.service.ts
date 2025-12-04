import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../shared/api/api-response';
import { PagoPendienteResponse } from '../../models/interfaces/response/pago-pendiente.response';
import { ComprobanteResponse } from '../../models/interfaces/response/comprobante.response';
import { RealizarPagoRequest } from '../../models/interfaces/request/realizar-pago.request';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/pagos';

  getPendingPayments(dni: string): Observable<ApiResponse<PagoPendienteResponse[]>> {
    return this.http.get<ApiResponse<PagoPendienteResponse[]>>(`${this.apiUrl}/pendientes/usuario/${dni}`);
  }

  payService(request: RealizarPagoRequest): Observable<ApiResponse<ComprobanteResponse>> {
    return this.http.post<ApiResponse<ComprobanteResponse>>(`${this.apiUrl}/realizar`, request);
  }
}