import { Component, signal } from '@angular/core';
import { SidebarComponent } from "../../components/sidebar/sidebar.component";
import { CommonModule, NgComponentOutlet } from '@angular/common';
import { DashboardHomeComponent } from '../dashboard-home/dashboard-home.component';

@Component({
  selector: 'app-dashboard',
  imports: [SidebarComponent, CommonModule, NgComponentOutlet, DashboardHomeComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
  public selectComponent = signal<any>(null);

  onSelect(component: any) {
    this.selectComponent.set(component);
  }
}
