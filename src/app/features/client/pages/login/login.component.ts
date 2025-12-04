import { Component, inject } from '@angular/core';
import { AuthService } from '../../../../core/services/auth.service';
import { LoadingService } from '../../../../core/services/loading.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { LucideAngularModule, ArrowRight } from "lucide-angular";
import { CommonModule } from '@angular/common';
import { SpinnerComponent } from '../../components/spinner/spinner.component';
import { LoginRequest } from '../../../../models/interfaces/request/login-request.interface';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule, LucideAngularModule, RouterModule, SpinnerComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  private authService = inject(AuthService);
  private loadingService = inject(LoadingService);
  private fb = inject(FormBuilder);
  private router = inject(Router);

  public readonly ArrowRightIcon = ArrowRight;
  public readonly isSpinning = this.loadingService.spinner;

  loginForm!: FormGroup;
  errorMessage: string | null = null;

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      nombre: ['', [Validators.required]],
      contrasena: ['', [Validators.required, Validators.minLength(5)]],
      tipoUsuario: ['CLIENTE', [Validators.required]]
    })
  }

  onLogin(): void {
    if (this.loginForm.valid) {
      this.errorMessage = null;

      const request: LoginRequest = this.loginForm.value;

      this.loadingService.loadingOn();
      const startTime = Date.now();

      const turnOffSpinner = () => {
        const MIN_DELAY_MS = 2000;
        const timeElapsed = Date.now() - startTime;
        const requiredDelay = MIN_DELAY_MS - timeElapsed;

        if (requiredDelay > 0) {
          setTimeout(() => this.loadingService.loadingOff(), requiredDelay)
        } else {
          this.loadingService.loadingOff();
        }
      }

      this.authService.login(request).subscribe({
        next: (response) => {
          if (response.success && response.data) {
            if (response.data.tipoUsuario === 'CLIENTE') {
              console.log('Login Exitoso como CLIENTE. Token:', response.data.token);
              turnOffSpinner();
              this.router.navigate(['/dashboard', 'client']);
            } else {
              this.authService.logout();
              console.warn(`Intento de acceso denegado. Rol detectado: ${response.data.tipoUsuario}`);
              this.errorMessage = 'Acceso denegado. Solo se permite el ingreso a usuarios con rol CLIENTE.';
              turnOffSpinner();
            }

          } else {
            this.errorMessage = response.message || 'Credenciales inválidas.';
            turnOffSpinner();
          }
        },
        error: (err) => {
          console.error('Error durante el login:', err);
          this.errorMessage = 'Error de conexión o credenciales incorrectas.';
        }
      });
    } else {
      this.loginForm.markAllAsTouched();
    }
  }

  goToHome(): void {
    this.router.navigate(['/']);
  }

  goToRegister(): void {
    this.router.navigate(['/register']);
  }
}
