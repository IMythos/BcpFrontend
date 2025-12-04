import { Component, signal } from '@angular/core';
import { SidebarComponent } from "../../components/sidebar/sidebar.component";
import { CommonModule, NgComponentOutlet } from '@angular/common';
import { DashboardHomeComponent } from '../dashboard-home/dashboard-home.component';
import { ArrowRightLeft, LayoutDashboard } from 'lucide-angular';
import { TransferComponent } from '../transfer/transfer';

@Component({
  selector: 'app-dashboard',
  imports: [SidebarComponent, CommonModule, NgComponentOutlet, DashboardHomeComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
  menuItems = signal([
    { 
      id: 1, 
      label: 'Resumen', 
      icon: LayoutDashboard, 
      component: DashboardHomeComponent 
    },
    { 
      id: 2, 
      label: 'Transferencias', 
      icon: ArrowRightLeft, 
      component: TransferComponent 
    },
  ]);
  public selectedComponent = signal<any>(null);

  onSelect(component: any) {
    this.selectedComponent.set(component);
  }
}