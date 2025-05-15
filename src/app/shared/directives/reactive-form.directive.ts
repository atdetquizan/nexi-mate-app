import {
  AfterViewInit,
  Directive,
  ElementRef,
  forwardRef,
  HostListener,
  Injector,
  Renderer2,
} from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  NgControl,
} from '@angular/forms';
import { MessagesValidators } from '../../core/constants';

@Directive({
  selector: '[vcpReactiveForm]',
  standalone: true,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ReactiveFormDirective),
      multi: true,
    },
  ],
})
export class ReactiveFormDirective
  implements ControlValueAccessor, AfterViewInit
{
  set hostValue(value: any) {
    this.renderer.setProperty(this.elementRef.nativeElement, 'value', value);
  }

  set hostDisabled(value: boolean) {
    this.renderer.setProperty(this.elementRef.nativeElement, 'disabled', value);
  }

  set hostTextError(value: string | null) {
    this.renderer.setProperty(
      this.elementRef.nativeElement,
      'textError',
      value
    );
  }

  onChange?: (value: unknown) => void;
  onTouched = () => {
    //
  };

  messages: { [validatorName: string]: (validatorValue?: any) => string } =
    MessagesValidators;

  private control: AbstractControl | null = null;

  constructor(
    private renderer: Renderer2,
    private elementRef: ElementRef,
    private injector: Injector
  ) {
    //
  }

  @HostListener('blurChange')
  onBlurChange() {
    this.onTouched();
  }

  @HostListener('valueChange', ['$event.detail'])
  onValueChange(value: any) {
    this.setValue(value);
  }

  ngAfterViewInit(): void {
    const ngControl = this.injector.get(NgControl, null);
    if (ngControl) {
      this.control = ngControl.control;

      this.control?.statusChanges?.subscribe(() => {
        this.updateErrorState();
      });

      // Verificar el estado inicial
      this.updateErrorState();
    }
  }

  /**
   * Actualiza el mensaje de error basado en el estado del control
   * Solo se mostrará si el campo ha sido tocado o modificado
   */
  updateErrorState() {
    if (this.control?.invalid && (this.control.touched || this.control.dirty)) {
      const firstErrorKey = Object.keys(this.control.errors || {})[0];
      const errorValue = this.control.errors?.[firstErrorKey];

      // Si el valor del error es un string, úsalo directamente como mensaje
      let errorMessage: string;
      if (typeof errorValue === 'string') {
        errorMessage = errorValue;
      } else if (this.messages[firstErrorKey]) {
        errorMessage = this.messages[firstErrorKey](errorValue);
      } else {
        errorMessage = 'Error desconocido';
      }

      this.hostTextError = errorMessage;
    } else {
      this.hostTextError = null;
    }
  }

  writeValue(value: any): void {
    this.hostValue = value === null ? '' : value;
    if (this.onChange) {
      this.onChange(value);
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.hostDisabled = isDisabled;
  }

  setValue(value: any) {
    this.hostValue = value;
    this.onChange?.(value);
    this.onTouched();
  }
}
