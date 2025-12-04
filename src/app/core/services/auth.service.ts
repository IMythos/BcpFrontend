import { HttpClient } from '@angular/common/http';
import { inject, Injectable, Signal, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { LoginResponse } from '../../shared/types/login-response';
import { LoginRequest } from '../../models/interfaces/request/login-request.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/auth';

  private _isAuthenticated = signal<boolean>(this.checkInitialAuthStatus());
  private _userDisplayname = signal<string | null>(this.getInitialUsername());
  private _userRole = signal<string | null>(this.getInitialUserRole());

  public isAuthenticated$: Signal<boolean> = this._isAuthenticated.asReadonly();
  public userDisplayname$: Signal<string | null> = this._userDisplayname.asReadonly();

  private checkInitialAuthStatus(): boolean {
    const token = localStorage.getItem('token');
    return !!token;
  }

  private getInitialUsername(): string | null {
    return localStorage.getItem('nombre');
  }

  private getInitialUserRole(): string | null {
    return localStorage.getItem('tipoUsuario');
  }

  private saveAuthData(token: string, tipoUsuario: string, nombre: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('tipoUsuario', tipoUsuario);
    localStorage.setItem('nombre', nombre);
  }

  login(request: LoginRequest): Observable<LoginResponse> {
    const endpoint = `${this.apiUrl}/login`;

    return this.http.post<LoginResponse>(endpoint, request)
      .pipe(
        tap(response => {
          if (response.success && response.data) {
            this.saveAuthData(response.data.token, response.data.tipoUsuario, response.data.nombre);
          }
        })
      )
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('tipoUsuario');
    localStorage.removeItem('nombre');

    this._isAuthenticated.set(false);
    this._userDisplayname.set(null);
    this._userRole.set(null);
  }

  public getToken(): string | null {
    return localStorage.getItem('token');
  }

  public isAuthenticated(): boolean {
    return this._isAuthenticated();
  }

  public getUserRole(): string | null {
    return this._userRole() || localStorage.getItem('tipoUsuario');
  }
}
