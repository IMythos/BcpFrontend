import { Component, inject } from '@angular/core';
import { HeaderComponent } from "../../../../shared/components/header/header.component";
import { CrearReclamoRequest } from '../../../../models/interfaces/request/crear-reclamo-request.interface';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReclamoService } from '../../../../core/services/reclamo.service';

@Component({
  selector: 'app-contact',
  imports: [HeaderComponent],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css',
})
export class ContactComponent {
private fb = inject(FormBuilder);
  private reclamoService = inject(ReclamoService);

  contactForm: FormGroup = this.fb.group({
    dniCliente: ['', [Validators.required, Validators.pattern(/^[0-9]{8}$/)]],
    descripcion: ['', [Validators.required, Validators.minLength(10)]]
  });

  isLoading = false;
  successMessage: string | null = null;
  errorMessage: string | null = null;

  onSubmit(): void {
    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.successMessage = null;
    this.errorMessage = null;

    const request: CrearReclamoRequest = this.contactForm.value;

    this.reclamoService.crearReclamo(request).subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.success) {
          this.successMessage = 'Su reclamo ha sido registrado exitosamente.';
          this.contactForm.reset();
        } else {
          this.errorMessage = response.message || 'Ocurrió un error al enviar el reclamo.';
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = 'Hubo un problema de conexión. Inténtelo más tarde.';
        console.error(err);
      }
    });
  }
}
