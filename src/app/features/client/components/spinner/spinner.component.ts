import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { LoadingService } from '../../../../core/services/loading.service';

@Component({
  selector: 'app-spinner',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  templateUrl: './spinner.component.html',
  styleUrl: './spinner.component.css',
})
export class SpinnerComponent {
  public loadingService = inject(LoadingService);

  public readonly isSpinning = this.loadingService.spinner;
}
