import { Component, signal } from '@angular/core';
import { LucideAngularModule, X, Menu, HandCoins, LockKeyhole } from "lucide-angular";
import { RouterLink } from "@angular/router";

@Component({
  selector: 'client-header',
  standalone: true,
  imports: [LucideAngularModule, RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  public readonly HandCoinsIcon = HandCoins;
  public readonly LockKeyholeIcon = LockKeyhole;
  public readonly MenuIcon = Menu;
  public readonly CloseIcon = X;

  public isOpenMenu = signal(false);

  public toggleMenu(): void {
    this.isOpenMenu.update(state => !state);
  }
}
