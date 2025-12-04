import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from "../../../../shared/components/header/header.component";
import { PaymentService } from '../../../../core/services/payment.service';
import { AuthService } from '../../../../core/services/auth.service'; // Importar AuthService

import { PagoPendienteResponse } from '../../../../models/interfaces/response/pago-pendiente.response';
import { ComprobanteResponse } from '../../../../models/interfaces/response/comprobante.response';
import { RealizarPagoRequest } from '../../../../models/interfaces/request/realizar-pago.request';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [HeaderComponent, CommonModule, FormsModule],
  templateUrl: './services.component.html',
  styleUrl: './services.component.css',
})
export class ServicesComponent implements OnInit {
  private paymentService = inject(PaymentService);
  private authService = inject(AuthService);

  currentUserDni: string | null = null;
  
  pendingPayments: PagoPendienteResponse[] = [];
  isLoading = false;
  errorMessage: string | null = null;
  
  selectedPaymentId: number | null = null;
  accountIdToPay: number | null = null;
  successComprobante: ComprobanteResponse | null = null;

  ngOnInit(): void {
    this.currentUserDni = this.authService.getCurrentUserDni();

    if (this.currentUserDni) {
      this.loadPendingPayments();
    } else {
      this.errorMessage = 'No se pudo identificar al usuario. Por favor inicie sesión nuevamente.';
    }
  }

  loadPendingPayments() {
    if (!this.currentUserDni) return;

    this.isLoading = true;
    this.paymentService.getPendingPayments(this.currentUserDni).subscribe({
      next: (res) => {
        this.isLoading = false;
        if (res.success) {
          this.pendingPayments = res.data ?? []; 
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = 'Error al cargar los servicios pendientes.';
        console.error(err);
      }
    });
  }

  initiatePayment(idPago: number) {
    this.selectedPaymentId = idPago;
    this.successComprobante = null;
    this.errorMessage = null;
  }

  confirmPayment() {
    if (!this.selectedPaymentId || !this.accountIdToPay) {
      this.errorMessage = 'Por favor, ingrese un ID de cuenta válido.';
      return;
    }

    const requestPayload: RealizarPagoRequest = {
      cuentaId: this.accountIdToPay,
      pagoId: this.selectedPaymentId
    };

    this.isLoading = true;
    this.paymentService.payService(requestPayload).subscribe({
      next: (res) => {
        this.isLoading = false;
        if (res.success) {
          this.successComprobante = res.data;
          this.pendingPayments = this.pendingPayments.filter(p => p.idPago !== this.selectedPaymentId);
          this.selectedPaymentId = null;
          this.accountIdToPay = null;
        } else {
          this.errorMessage = res.message || 'Error al procesar el pago.';
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = 'Error de conexión o saldo insuficiente.';
      }
    });
  }

  cancelPayment() {
    this.selectedPaymentId = null;
    this.accountIdToPay = null;
    this.errorMessage = null;
  }
}