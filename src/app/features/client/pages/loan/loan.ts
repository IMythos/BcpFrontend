import { Component, inject, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LucideAngularModule, HandCoins, Calendar, Calculator, CheckCircle } from 'lucide-angular';
import { LoanService } from '../../../../core/services/loan.service';
import { ClientDataService } from '../../../../core/services/client-data.service';
import { SolicitudCreditoRequest } from '../../../../models/interfaces/request/solicitud-credito.request';
import { PrestamoResponse } from '../../../../models/interfaces/response/prestamo.response';

@Component({
  selector: 'app-loan',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LucideAngularModule, CurrencyPipe],
  templateUrl: './loan.html',
})
export class LoanComponent implements OnInit {
  private fb = inject(FormBuilder);
  private loanService = inject(LoanService);
  private clientDataService = inject(ClientDataService);

  readonly HandCoinsIcon = HandCoins;
  readonly CalendarIcon = Calendar;
  readonly CalculatorIcon = Calculator;
  readonly CheckCircleIcon = CheckCircle;

  isLoading = false;
  successLoan: PrestamoResponse | null = null;
  errorMessage: string | null = null;
  userId: number | null = null;

  loanForm: FormGroup = this.fb.group({
    monto: ['', [Validators.required, Validators.min(100), Validators.max(50000)]],
    plazoMeses: ['', [Validators.required, Validators.min(1), Validators.max(60)]]
  });

  cuotaEstimada: number = 0;

  ngOnInit() {
    this.fetchUserId();
    
    // Calcular cuota en tiempo real (simulación)
    this.loanForm.valueChanges.subscribe(val => {
      this.calculateQuota(val.monto, val.plazoMeses);
    });
  }

  fetchUserId() {
    this.isLoading = true;
    this.clientDataService.getDashboardData().subscribe({
      next: (res) => {
        this.isLoading = false;
        if (res.success && res.data?.informacionUsuario) {
          // Asumimos que userInfo tiene el ID (según tu LoadClientDataDTO -> UserInfo)
          this.userId = res.data.informacionUsuario.id; 
        }
      },
      error: () => this.isLoading = false
    });
  }

  calculateQuota(monto: number, meses: number) {
    if (monto > 0 && meses > 0) {
      // Interés referencial del 15% anual para simulación visual
      const i = 0.15 / 12; 
      this.cuotaEstimada = monto * ( (i * Math.pow(1+i, meses)) / (Math.pow(1+i, meses) - 1) );
    } else {
      this.cuotaEstimada = 0;
    }
  }

  onSubmit() {
    if (this.loanForm.invalid || !this.userId) return;

    this.isLoading = true;
    this.errorMessage = null;

    const request: SolicitudCreditoRequest = {
      usuarioId: this.userId,
      monto: Number(this.loanForm.value.monto),
      plazoMeses: Number(this.loanForm.value.plazoMeses)
    };

    this.loanService.requestLoan(request).subscribe({
      next: (res) => {
        this.isLoading = false;
        if (res.success && res.data) {
          this.successLoan = res.data;
          this.loanForm.disable();
        } else {
          this.errorMessage = res.message || 'Error al procesar la solicitud.';
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = 'Hubo un error de conexión o rechazo automático.';
      }
    });
  }

  reset() {
    this.successLoan = null;
    this.loanForm.reset();
    this.loanForm.enable();
    this.cuotaEstimada = 0;
  }
}