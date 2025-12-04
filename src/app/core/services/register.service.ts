import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ClientRequest } from '../../models/interfaces/request/client-request.interface';
import { Observable } from 'rxjs';
import { RegisterClientResponse } from '../../shared/types/register-client-response';
import { EmployeeRequest } from '../../models/interfaces/request/employee-request.interface';
import { RegisterEmployeeResponse } from '../../shared/types/register-employee-response';

@Injectable({
  providedIn: 'root',
})
export class RegisterService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/registro';

  registerClient(request: ClientRequest): Observable<RegisterClientResponse> {
   const endpoint = `${this.apiUrl}/cliente`;

   return this.http.post<RegisterClientResponse>(endpoint, request);
  }

  registerEmployee(request: EmployeeRequest): Observable<RegisterEmployeeResponse> {
    const endpoint = `${this.apiUrl}/empleado`;

    return this.http.post<RegisterEmployeeResponse>(endpoint, request);
  }
}
