import { Component, EventEmitter, inject, Output, signal } from '@angular/core';
import { AuthService } from '../../../../core/services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { LucideIconData } from 'lucide-angular';
import { LucideAngularModule, UserRoundPen, Route, ClipboardMinus, PackagePlus, TicketCheck, LogOut, House  } from 'lucide-angular';
import { CommonModule } from '@angular/common';
import { DashboardHomeComponent } from '../../pages/dashboard-home/dashboard-home.component';

export interface MenuItem {
  id: number;
  icon: LucideIconData;
  label: string;
  component: any;
}

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule, RouterModule, LucideAngularModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
})
export class SidebarComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  public menuItems = signal<MenuItem[]>([]);
  public username = this.authService.userDisplayname$;
  public role = this.authService.getUserRole();

  @Output() selectComponent = new EventEmitter<any>();

  public UserRoundPenIcon = UserRoundPen;
  public RouteIcon = Route;
  public ClipboardMinusIcon = ClipboardMinus;
  public PackagePlusIcon = PackagePlus;
  public TicketCheckIcon = TicketCheck;
  public LogOutIcon = LogOut;
  public HouseIcon = House;

  constructor() {
    if (this.role === 'CLIENTE') {
      this.menuItems.set([
        { id: 1, icon: this.HouseIcon, label: 'Dashboard', component: DashboardHomeComponent },
      ]);
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }

  select(component: any) {
    this.selectComponent.emit(component);
  }
}
