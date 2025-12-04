import { Component } from '@angular/core';
import { HeaderComponent } from "../../../../shared/components/header/header.component";
import { BannerComponent } from '../../../../shared/components/banner/banner.component';
import { LucideAngularModule, Check, ChevronLeft, ChevronRight } from 'lucide-angular';
import { SliderComponent } from "../../components/slider/slider.component";
import { RouterLink } from '@angular/router';

@Component({
  selector: 'client-home',
  imports: [HeaderComponent, BannerComponent, LucideAngularModule, SliderComponent, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  public CheckIcon = Check;
  public ChevronLeftIcon = ChevronLeft;
  public ChevronRightIcon = ChevronRight;

  public sliderData = [
    { url: 'assets/images/slide-1.png', title: '¿No sabes qué hacer con tu retiro de AFP? Te aconsejamos | Banco Pichincha', description: '¿Necesitas ideas de qué hacer con tu octavo retiro AFP 2025? Aquí te brindamos algunos consejos.' },
    { url: 'assets/images/slide-2.png', title: 'Lo que debes saber del octavo retiro AFP 2025 | Banco Pichincha', description: 'Descubre aquí todo sobre el proceso para poder acceder al octavo retiro AFP 2025 y acceder a tus ahorros.' },
    { url: 'assets/images/slide-3.png', title: 'Cancelación y Apertura Plazo Fijo', description: 'Te enseñamos cómo cancelar y abrir un Depósito a Plazo Fijo.' },
    { url: 'assets/images/slide-4.png', title: 'Transferencias interbancarias', description: 'Mueve tu dinero fácilmente desde la App Banco Pichincha.' },
    { url: 'assets/images/slide-5.png', title: 'Envía dinero desde tu celular', description: 'Te mostramos cómo recibir y enviar dinero desde la APP.' },
    { url: 'assets/images/slide-6.png', title: 'Consulta movimientos y saldos', description: 'Te mostramos cómo ver tus saldos y movimientos desde la APP.' },
    { url: 'assets/images/slide-7.png', title: 'Tipo de cambio exclusivo en tasas', description: 'Aprende a cambiar dólares o soles facilmente desde la APP.' },
    { url: 'assets/images/slide-8.png', title: 'Pago de Servicios desde cualquier lugar', description: 'Descubre cómo pagar tus servicios desde la App.' },
    { url: 'assets/images/slide-9.png', title: ' Pago de Préstamo desde la comodidad de tu hogar', description: 'Te explicamos cómo pagar tu préstamo desde la App.' },
    { url: 'assets/images/slide-10.png', title: ' Crear tu usuario digital en BCP ', description: 'Crea tu usuario digital fácilmente desde la App Banco BCP.' }
  ];

  currentSlideIndex: number = 0;

  handleNext(): void {
    this.currentSlideIndex = (this.currentSlideIndex + 1) % this.sliderData.length
  }

  handlePrev(): void {
    this.currentSlideIndex = (this.currentSlideIndex - 1 + this.sliderData.length) % this.sliderData.length;
  }
}
