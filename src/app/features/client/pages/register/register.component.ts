import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { RegisterService } from '../../../../core/services/register.service';
import { ClientRequest } from '../../../../models/interfaces/request/client-request.interface';
import { AuthService } from '../../../../core/services/auth.service';
import { catchError, of, switchMap, throwError } from 'rxjs';
import { LoginRequest } from '../../../../models/interfaces/request/login-request.interface';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterLink, CommonModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent implements OnInit {
  private fb = inject(FormBuilder);
  private registerService = inject(RegisterService);
  private authService = inject(AuthService);

  private router = inject(Router);

  public registerForm!: FormGroup;

  public isLoading: boolean = false;
  public errorMessage: string | null = null;

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      nombre: ['', [Validators.required]],
      contrasena: ['', [Validators.required, Validators.minLength(6)]],
      correo: ['', [Validators.required, Validators.email]],
      dni: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(8)]],
      direccion: ['', [Validators.required]],
      telefono: ['', [Validators.required, Validators.minLength(9), Validators.maxLength(9)]],
    });
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;

    const registerRequest: ClientRequest = {
        nombre: this.registerForm.value.nombre,
        contrasena: this.registerForm.value.contrasena,
        correo: this.registerForm.value.correo,
        dni: this.registerForm.value.dni,
        direccion: this.registerForm.value.direccion,
        telefono: this.registerForm.value.telefono,
    };

    this.registerService.registerClient(registerRequest)
      .pipe(
        switchMap(registerResponse => {
          if (!registerResponse.success) {
            return throwError(() => new Error(registerResponse.message || 'El registro no fue exitoso.'));
          }

          const loginRequest: LoginRequest = {
            nombre: this.registerForm.value.nombre,
            contrasena: this.registerForm.value.contrasena,
            tipoUsuario: 'CLIENTE'
          };

          return this.authService.login(loginRequest);
        }),

        catchError(err => {
          this.isLoading = false;
          this.errorMessage = err.error?.message || 'Error durante la autenticación automática post-registro.';

          console.error('Error en el flujo de registro/login:', err);
          return of(null as any);
        })
      )

      .subscribe({
        next: (loginResponse) => {
          if (!loginResponse) {
            return;
          }

          this.isLoading = false;
          if (loginResponse.success) {
            this.router.navigate(['/dashboard', 'client']);
          } else {
            this.errorMessage = loginResponse.message || 'Registro exitoso, pero falló la autenticación.';
          }
        },
        error: (err) => {
          console.error('Error final de suscripción (redundante):', err);
        }
      });
  }
}
