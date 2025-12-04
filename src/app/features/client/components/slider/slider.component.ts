import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'slider',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './slider.component.html',
  styleUrl: './slider.component.css',
})
export class SliderComponent {
  @Input() slides: { url: string, title: string, description: string }[] = [];
  @Input() currentIndex: number = 0;

  @Output() nextRequest = new EventEmitter<void>();
  @Output() prevRequest = new EventEmitter<void>();

  requestNext(): void {
    this.nextRequest.emit();
  }

  requestPrev(): void {
    this.prevRequest.emit();
  }
}
