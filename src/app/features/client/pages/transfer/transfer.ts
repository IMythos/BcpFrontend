import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LucideAngularModule, ArrowRightLeft, ShieldCheck, CheckCircle, CreditCard, User, Banknote } from 'lucide-angular';
import { AccountService } from '../../../../core/services/account.service';
import { AuthService } from '../../../../core/services/auth.service';
import { CuentaResponse } from '../../../../models/interfaces/response/cuenta.response';
import { TransferenciaRequest } from '../../../../models/interfaces/request/transferencia.request';
import { ComprobanteResponse } from '../../../../models/interfaces/response/comprobante.response';

type TransferStep = 'FORM' | 'OTP' | 'SUCCESS';

@Component({
  selector: 'app-transfer',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LucideAngularModule, CurrencyPipe, DatePipe],
  templateUrl: './transfer.html',
})
export class TransferComponent implements OnInit {
  private accountService = inject(AccountService);
  private authService = inject(AuthService);
  private fb = inject(FormBuilder);

  readonly ArrowIcon = ArrowRightLeft;
  readonly ShieldIcon = ShieldCheck;
  readonly CheckIcon = CheckCircle;
  readonly CardIcon = CreditCard;
  readonly UserIcon = User;
  readonly MoneyIcon = Banknote;

  currentStep: TransferStep = 'FORM';
  isLoading = false;
  errorMessage: string | null = null;
  
  myAccounts: CuentaResponse[] = [];
  currentUserDni: string | null = null;
  successComprobante: ComprobanteResponse | null = null;

  transferForm: FormGroup = this.fb.group({
    originAccountId: ['', [Validators.required]],
    destinationAccountId: ['', [Validators.required, Validators.pattern(/^[0-9]+$/)]],
    amount: ['', [Validators.required, Validators.min(1)]]
  });

  otpForm: FormGroup = this.fb.group({
    otpCode: ['', [Validators.required, Validators.minLength(4)]]
  });

  ngOnInit() {
    this.currentUserDni = this.authService.getCurrentUserDni();
    this.loadAccounts();
  }

  loadAccounts() {
    if (!this.currentUserDni) return;
    this.accountService.getAccountsByDni(this.currentUserDni).subscribe({
      next: (res) => {
        if (res.success) this.myAccounts = res.data ?? [];
        if (this.myAccounts.length > 0) {
          this.transferForm.patchValue({ originAccountId: this.myAccounts[0].id });
        }
      }
    });
  }

  onInitiateTransfer() {
    if (this.transferForm.invalid) {
      this.transferForm.markAllAsTouched();
      return;
    }

    const { originAccountId, destinationAccountId, amount } = this.transferForm.value;
    
    if (originAccountId == destinationAccountId) {
      this.errorMessage = "La cuenta de destino no puede ser la misma que la de origen.";
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;

    const request: TransferenciaRequest = {
      idCuentaDestino: Number(destinationAccountId),
      monto: Number(amount)
    };

    this.accountService.initiateTransfer(originAccountId, request).subscribe({
      next: (res) => {
        this.isLoading = false;
        if (res.success) {
          this.currentStep = 'OTP';
        } else {
          this.errorMessage = res.message || 'Error al iniciar transferencia';
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.message || 'Fondos insuficientes o cuenta destino inválida.';
      }
    });
  }

  onConfirmOtp() {
    if (this.otpForm.invalid || !this.currentUserDni) return;

    this.isLoading = true;
    this.errorMessage = null;
    const otp = this.otpForm.get('otpCode')?.value;

    this.accountService.confirmTransfer(this.currentUserDni, otp).subscribe({
      next: (res) => {
        this.isLoading = false;
        if (res.success && res.data) {
          this.successComprobante = res.data;
          this.currentStep = 'SUCCESS';
        } else {
          this.errorMessage = res.message || 'Código OTP incorrecto';
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = 'Error al validar OTP. Intente nuevamente.';
      }
    });
  }

  resetProcess() {
    this.currentStep = 'FORM';
    this.transferForm.reset();
    this.otpForm.reset();
    this.successComprobante = null;
    this.loadAccounts();
  }
}