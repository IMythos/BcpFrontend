import { Component, inject, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { LucideAngularModule, CircleDollarSign, CircleUserRound, Truck, RefreshCcw, Landmark, Clock, FileText, ListOrdered, Wallet, Smartphone, MapPin, MailIcon, UserIcon } from 'lucide-angular';
import { of, tap, catchError } from 'rxjs';
import { LoadClientDataDTO } from '../../../../models/dtos/load-client-data.interface';
import { Movimiento } from '../../../../models/dtos/movimiento.interface';
import { ClientDataService } from '../../../../core/services/client-data.service';
import { LoadingService } from '../../../../core/services/loading.service';

@Component({
  selector: 'app-dashboard-home',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, CurrencyPipe, DatePipe],
  templateUrl: './dashboard-home.component.html',
  styleUrl: './dashboard-home.component.css',
})
export class DashboardHomeComponent implements OnInit {
  private clientDataService = inject(ClientDataService);
  private loadingService = inject(LoadingService);

  public readonly CircleDollarSignIcon = CircleDollarSign;
  public readonly CircleUserRoundIcon = CircleUserRound;
  public readonly RefreshCcwIcon = RefreshCcw;
  public readonly LandmarkIcon = Landmark;
  public readonly ClockIcon = Clock;
  public readonly FileTextIcon = FileText;
  public readonly ListOrderedIcon = ListOrdered;
  public readonly WalletIcon = Wallet;
  public readonly SmartphoneIcon = Smartphone;
  public readonly MapPinIcon = MapPin;
  public readonly MailIcon = MailIcon;
  public readonly UserIcon = UserIcon;

  dashboardData: LoadClientDataDTO | null = null;
  loadingError: string | null = null;
  isLoadingData: boolean = true;

  totalCuentas: number = 0;
  totalPagosPendientes: number = 0;
  totalSaldoGlobal: number = 0;

  recentMovements: Movimiento[] = [];

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.isLoadingData = true;
    this.loadingError = null;

    this.clientDataService.getDashboardData().pipe(
      tap(response => {
        if (response.success && response.data) {
          this.dashboardData = response.data;
          this.processDashboardData(response.data);
        } else {
          this.loadingError = response.message || 'Error al cargar los datos del dashboard.';
          this.dashboardData = null;
        }
      }),
      catchError((err: any) => {
        console.error('Error al llamar a /api/cliente/dashboard:', err);

        this.loadingError = 'Error de conexión o sesión inválida. Por favor, reintente.';
        this.dashboardData = null;
        return of(null);
      })
    ).subscribe(() => {
      this.isLoadingData = false;
    });
  }

  processDashboardData(data: LoadClientDataDTO): void {
    this.totalCuentas = data.cuentas ? data.cuentas.length : 0;
    this.totalPagosPendientes = data.pagosPendientes ? data.pagosPendientes.length : 0;

    this.totalSaldoGlobal = data.cuentas.reduce((sum, cuenta) => sum + cuenta.saldo, 0);
    this.recentMovements = data.cuentas
      .flatMap(cuenta => cuenta.movimientos)
      .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())
      .slice(0, 5);
  }

  getSaldoClass(saldo: number): string {
    return saldo > 0 ? 'text-green-600' : (saldo < 0 ? 'text-red-600' : 'text-gray-600');
  }

  getMovimientoColor(tipo: string, monto: number): string {
    if (tipo === 'DEBITO' || monto < 0) {
      return 'text-red-600';
    }
    if (tipo === 'CREDITO' || monto > 0) {
      return 'text-green-600';
    }
    return 'text-gray-600';
  }
}
