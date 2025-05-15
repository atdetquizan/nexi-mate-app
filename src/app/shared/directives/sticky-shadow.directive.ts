import { AfterViewInit, Directive, ElementRef, HostListener, inject, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appStickyShadow]'
})
export class StickyShadowDirective implements AfterViewInit {
  private stickyOffsetTop: number = 0;
  private el = inject(ElementRef);
  private renderer = inject(Renderer2);

  ngAfterViewInit() {
    const element = this.el.nativeElement as HTMLElement;
    this.stickyOffsetTop = element.offsetTop;
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const element = this.el.nativeElement as HTMLElement;
    const currentScroll = window.pageYOffset || document.documentElement.scrollTop;

    if (currentScroll > this.stickyOffsetTop) {
      this.renderer.addClass(element, 'sticky-shadow-active');
    } else {
      this.renderer.removeClass(element, 'sticky-shadow-active');
    }
  }

}
