import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ClientDashboardResponse } from '../../shared/types/client-dashboard-response';
import { ApiResponse } from '../../shared/api/api-response';
import { LoadClientDataDTO } from '../../models/dtos/load-client-data.interface';


@Injectable({
  providedIn: 'root'
})
export class ClientDataService {
  private http = inject(HttpClient);
  private apiUrl = `http://localhost:8080/api/cliente/dashboard`;

  getDashboardData(): Observable<ApiResponse<LoadClientDataDTO>> {
    return this.http.get<ApiResponse<LoadClientDataDTO>>(this.apiUrl);
  }
}
