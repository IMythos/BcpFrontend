import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../shared/api/api-response';
import { CrearReclamoRequest } from '../../models/interfaces/request/crear-reclamo-request.interface';

@Injectable({
  providedIn: 'root'
})
export class ReclamoService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/reclamos'; 

  crearReclamo(request: CrearReclamoRequest): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(this.apiUrl, request);
  }
}