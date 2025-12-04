import { Injectable, signal } from "@angular/core";

@Injectable({
  providedIn: 'root'
})

export class LoadingService {
  private loading = signal(false);
  spinner = this.loading.asReadonly();

  loadingOn(): void {
    this.loading.set(true);
  }

  loadingOff(): void {
    this.loading.set(false);
  }
}
