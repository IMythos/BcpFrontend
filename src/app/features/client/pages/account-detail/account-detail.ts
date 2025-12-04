import { Component, inject, Input, OnInit, signal } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { LucideAngularModule, ArrowLeft, Download, Search, Filter } from 'lucide-angular';
import { AccountService } from '../../../../core/services/account.service';
import { DetalleCuenta } from '../../../../models/dtos/account-detail.interface';
import { Movimiento } from '../../../../models/dtos/movimiento.interface';

@Component({
  selector: 'app-account-detail',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, CurrencyPipe, DatePipe],
  templateUrl: './account-detail.html'
})
export class AccountDetailComponent implements OnInit {
  private accountService = inject(AccountService);

  @Input() accountId!: number; 
  @Input() returnToDashboard!: () => void;

  accountData: DetalleCuenta | null = null;
  movements: Movimiento[] = [];
  isLoading = true;

  // Iconos
  readonly ArrowLeftIcon = ArrowLeft;
  readonly DownloadIcon = Download;
  readonly SearchIcon = Search;

  ngOnInit() {
    if (this.accountId) {
      this.loadDetail();
    }
  }

  loadDetail() {
    this.isLoading = true;
    this.accountService.getAccountDetail(this.accountId).subscribe({
      next: (res) => {
        this.isLoading = false;
        if (res.success && res.data) {
          this.accountData = res.data;
          // Ordenar movimientos por fecha descendente
          this.movements = (res.data.movimientos || []).sort((a, b) => 
            new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
          );
        }
      },
      error: () => this.isLoading = false
    });
  }

  getMovimientoColor(tipo: string): string {
    return tipo === 'DEBITO' ? 'text-red-600' : 'text-green-600';
  }
  
  getMovimientoSigno(tipo: string): string {
    return tipo === 'DEBITO' ? '-' : '+';
  }
}