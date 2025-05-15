import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[dialog]',
  standalone: true,
})
export class DialogDirective {
  constructor(public viewContainerRef: ViewContainerRef) {}
}
