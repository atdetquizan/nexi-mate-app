import { isPlatformBrowser } from '@angular/common';
import {
  Directive,
  ElementRef,
  HostListener,
  Inject,
  inject,
  OnDestroy,
  output,
  PLATFORM_ID,
} from '@angular/core';

@Directive({
  selector: '[clickOutside]',
  standalone: true,
})
export class ClickOutsideDirective implements OnDestroy {
  /**
   * Outside  of click outside directive
   */
  clickOutside = output<void>();
  /**
   * Element ref of click outside directive
   */
  elementRef = inject(ElementRef);
  /**
   * Observer  of click outside directive
   */
  private observer?: IntersectionObserver;
  /**
   * Determines whether visible is
   */
  private isVisible = false;
  /**
   * Creates an instance of click outside directive.
   */
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    if (isPlatformBrowser(this.platformId)) {
      // Configuramos el Intersection Observer para observar la visibilidad del elemento
      this.observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          this.isVisible = entry.isIntersecting; // Almacena el estado de visibilidad
        });
      });

      // Inicia la observación del elemento
      this.observer.observe(this.elementRef.nativeElement);
    }
  }
  /**
   * Hosts listener
   * @param {HTMLElement} targetElement
   */
  @HostListener('document:click', ['$event.target'])
  onClick(targetElement: HTMLElement): void {
    const clickedInside = this.elementRef.nativeElement.contains(targetElement);

    if (!clickedInside && this.isVisible) {
      this.clickOutside.emit();
    }
  }
  /**
   * on destroy
   */
  ngOnDestroy(): void {
    // Desconecta el observador cuando la directiva se destruye
    this.observer?.disconnect();
  }
}
