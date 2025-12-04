import { Component, inject, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import {
  LucideAngularModule,
  CircleDollarSign,
  CircleUserRound,
  Truck,
  RefreshCcw,
  Landmark,
  Clock,
  FileText,
  ListOrdered,
  Wallet,
  Smartphone,
  MapPin,
  MailIcon,
  UserIcon,
  Plus,
  X,
} from 'lucide-angular';
import { of, tap, catchError } from 'rxjs';
import { LoadClientDataDTO } from '../../../../models/dtos/load-client-data.interface';
import { Movimiento } from '../../../../models/dtos/movimiento.interface';
import { ClientDataService } from '../../../../core/services/client-data.service';
import { LoadingService } from '../../../../core/services/loading.service';
import { AccountService } from '../../../../core/services/account.service';
import { AuthService } from '../../../../core/services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CuentaResponse } from '../../../../models/interfaces/response/cuenta.response';
import { CrearCuentaRequest } from '../../../../models/interfaces/request/crear-cuenta.request';

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
  private accountService = inject(AccountService);
  private authService = inject(AuthService);
  private fb = inject(FormBuilder);
  accounts: CuentaResponse[] = [];
  isLoadingAccounts = false;
  showCreateModal = false;
  isCreating = false;
  createAccountForm: FormGroup = this.fb.group({
    tipo: ['AHORRO', [Validators.required]],
    saldo: [0, [Validators.required, Validators.min(0)]]
  });

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
  public readonly PlusIcon = Plus; 
  public readonly XIcon = X;

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

    this.clientDataService
      .getDashboardData()
      .pipe(
        tap((response) => {
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
      )
      .subscribe(() => {
        this.isLoadingData = false;
      });
  }

  processDashboardData(data: LoadClientDataDTO): void {
    this.totalCuentas = data.cuentas ? data.cuentas.length : 0;
    this.totalPagosPendientes = data.pagosPendientes ? data.pagosPendientes.length : 0;

    this.totalSaldoGlobal = data.cuentas.reduce((sum, cuenta) => sum + cuenta.saldo, 0);
    this.recentMovements = data.cuentas
      .flatMap((cuenta) => cuenta.movimientos)
      .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())
      .slice(0, 5);
  }

  getSaldoClass(saldo: number): string {
    return saldo > 0 ? 'text-green-600' : saldo < 0 ? 'text-red-600' : 'text-gray-600';
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
  loadAccounts() {
    const dni = this.authService.getCurrentUserDni();
    if (!dni) return;

    this.isLoadingAccounts = true;
    this.accountService.getAccountsByDni(dni).subscribe({
      next: (res) => {
        this.isLoadingAccounts = false;
        if (res.success) {
          this.accounts = res.data ?? [];
        }
      },
      error: (err) => {
        this.isLoadingAccounts = false;
        console.error('Error cargando cuentas', err);
      },
    });
  }

  openCreateModal() {
    this.showCreateModal = true;
    this.createAccountForm.reset({ tipo: 'AHORRO', saldo: 0 });
  }

  closeCreateModal() {
    this.showCreateModal = false;
  }

  submitCreateAccount() {
    const dni = this.authService.getCurrentUserDni();
    if (this.createAccountForm.invalid || !dni) return;

    this.isCreating = true;
    const request: CrearCuentaRequest = this.createAccountForm.value;

    this.accountService.createAccount(dni, request).subscribe({
      next: (res) => {
        this.isCreating = false;
        if (res.success) {
          this.closeCreateModal();
          this.loadAccounts();
        }
      },
      error: (err) => {
        this.isCreating = false;
      },
    });
  }
  
}
