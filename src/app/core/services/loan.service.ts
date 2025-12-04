import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../shared/api/api-response';
import { SolicitudCreditoRequest } from '../../models/interfaces/request/solicitud-credito.request';
import { PrestamoResponse } from '../../models/interfaces/response/prestamo.response';

@Injectable({
  providedIn: 'root'
})
export class LoanService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/prestamos';

  requestLoan(request: SolicitudCreditoRequest): Observable<ApiResponse<PrestamoResponse>> {
    return this.http.post<ApiResponse<PrestamoResponse>>(`${this.apiUrl}/solicitar`, request);
  }
}