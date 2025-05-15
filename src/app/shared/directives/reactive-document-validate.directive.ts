import {
  Directive,
  ElementRef,
  forwardRef,
  input,
  OnChanges,
  Renderer2,
  SimpleChanges,
} from '@angular/core';
import {
  AbstractControl,
  NG_VALIDATORS,
  ValidationErrors,
} from '@angular/forms';
import { DocumentTypeId } from '../../core/enums';

@Directive({
  selector: '[vcpReactiveDocumentValidate]',
  standalone: true,
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => ReactiveDocumentValidateDirective),
      multi: true,
    },
  ],
})
export class ReactiveDocumentValidateDirective implements OnChanges {
  set hostMaxlength(value: any) {
    this.renderer.setProperty(
      this.elementRef.nativeElement,
      'maxlength',
      value
    );
  }

  set hostType(value: 'numeric' | 'alphanumeric') {
    this.renderer.setProperty(this.elementRef.nativeElement, 'type', value);
  }

  documentType = input<DocumentTypeId>();

  constructor(private renderer: Renderer2, private elementRef: ElementRef) {
    //
  }
  ngOnChanges(changes: SimpleChanges): void {
    const value = changes['documentType'].currentValue;
    
    if (value === DocumentTypeId.DNI) {
      this.hostMaxlength = 8;
      this.hostType = 'numeric';
    } else if (value === DocumentTypeId.CEX) {
      this.hostMaxlength = 9;
      this.hostType = 'alphanumeric';
    }
  }

  validate(control: AbstractControl): ValidationErrors | null {
    const type = this.documentType();

    if (type) {
      const validatorFn = this.getValidator(type);

      return validatorFn ? validatorFn(control) : null;
    }

    return null;
  }

  getValidator(documentType: DocumentTypeId) {
    switch (documentType) {
      case DocumentTypeId.DNI:
        this.hostMaxlength = 8;
        this.hostType = 'numeric';
        return this.dniValidator;
      case DocumentTypeId.CEX:
        this.hostMaxlength = 9;
        this.hostType = 'alphanumeric';
        return this.ceValidator;
      default:
        return null;
    }
  }

  dniValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value || '';
    const isValid = /^[0-9]{8}$/.test(value); // DNI: 8 dígitos
    return isValid ? null : { invalidDNI: true };
  }

  ceValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value || '';
    const isValid = /^[A-Z0-9]{9}$/.test(value); // Carnet de extranjería: 9 alfanuméricos
    return isValid ? null : { invalidCE: true };
  }
}
