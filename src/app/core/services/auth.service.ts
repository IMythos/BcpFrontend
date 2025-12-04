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
  private _userDni = signal<string | null>(this.getInitialUserDni());

  public isAuthenticated$: Signal<boolean> = this._isAuthenticated.asReadonly();
  public userDisplayname$: Signal<string | null> = this._userDisplayname.asReadonly();

  private checkInitialAuthStatus(): boolean {
    return !!localStorage.getItem('token');
  }

  private getInitialUsername(): string | null {
    return localStorage.getItem('nombre');
  }

  private getInitialUserRole(): string | null {
    return localStorage.getItem('tipoUsuario');
  }

  private getInitialUserDni(): string | null {
    return localStorage.getItem('dni');
  }

  private saveAuthData(data: { token: string; tipoUsuario: string; nombre: string; dni: string }) {
    localStorage.setItem('token', data.token);
    localStorage.setItem('tipoUsuario', data.tipoUsuario);
    localStorage.setItem('nombre', data.nombre);
    localStorage.setItem('dni', data.dni); 

    this._isAuthenticated.set(true);
    this._userDisplayname.set(data.nombre);
    this._userRole.set(data.tipoUsuario);
    this._userDni.set(data.dni);
  }

  login(request: LoginRequest): Observable<LoginResponse> {
    const endpoint = `${this.apiUrl}/login`;

    return this.http.post<LoginResponse>(endpoint, request)
      .pipe(
        tap(response => {
          if (response.success && response.data) {
            this.saveAuthData(response.data);
          }
        })
      );
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('tipoUsuario');
    localStorage.removeItem('nombre');
    localStorage.removeItem('dni');

    this._isAuthenticated.set(false);
    this._userDisplayname.set(null);
    this._userRole.set(null);
    this._userDni.set(null);
  }

  public getCurrentUserDni(): string | null {
    return this._userDni() || localStorage.getItem('dni');
  }
  public getUserRole(): string | null {
    return this._userRole() || localStorage.getItem('tipoUsuario');
  }
  public getToken(): string | null {
    return localStorage.getItem('token');
  }
}