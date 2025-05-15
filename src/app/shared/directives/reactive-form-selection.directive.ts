import {
  AfterViewInit,
  Directive,
  ElementRef,
  forwardRef,
  HostListener,
  Injector,
  input,
  OnDestroy,
  OnInit,
  Renderer2,
} from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  NgControl,
} from '@angular/forms';

type ElementType = 'vcp-checkbox' | 'vcp-radio' | 'vcp-checkbox-card' | 'vcp-radio-card';
interface ValueChangeEvent {
  detail: {
    value: any;
    checked?: boolean;
  };
}

@Directive({
  selector: '[vcpReactiveSelectionForm]',
  standalone: true,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ReactiveSelectionFormDirective),
      multi: true,
    },
  ],
})
export class ReactiveSelectionFormDirective
  implements OnInit, AfterViewInit, OnDestroy, ControlValueAccessor
{
  multiple = input<boolean>(false);

  private control: AbstractControl | null = null;
  private elementType: ElementType | null = null;
  private initialized = false;
  private isCheckbox = false;

  onChange: (value: any) => void = () => {};
  onTouched: () => void = () => {};

  constructor(
    private renderer: Renderer2,
    private elementRef: ElementRef<any>,
    private injector: Injector
  ) {}

  @HostListener('valueChange', ['$event'])
  onValueChange(event: ValueChangeEvent): void {
    if (!this.elementType || !this.initialized || !this.control) return;

    const value = event.detail.value;
    const checked = event.detail.checked ?? false;

    if (this.isCheckbox && this.multiple()) {
      const currentValues = Array.isArray(this.control.value) ? this.control.value : [];
      if (checked) {
        this.onChange([...currentValues, value]);
      } else {
        this.onChange(currentValues.filter(v => v !== value));
      }
    } else if (this.isCheckbox) {
      this.onChange(value ?? checked);
    } else {
      this.onChange(value ?? null);
    }
    
    this.onTouched();
  }

  ngOnInit(): void {
    const element = this.elementRef.nativeElement;
    const tagName = element.tagName.toLowerCase();

    if (
      [
        'vcp-radio-card',
        'vcp-checkbox-card',
        'vcp-checkbox',
        'vcp-radio',
      ].includes(tagName)
    ) {
      this.elementType = tagName as ElementType;
      this.isCheckbox = tagName === 'vcp-checkbox' || tagName === 'vcp-checkbox-card';
    }
  }

  writeValue(value: any): void {
    if (!this.elementType) return;

    const element = this.elementRef.nativeElement;
    
    if (this.isCheckbox && this.multiple()) {
      const values = Array.isArray(value) ? value : [];
      element.checked = values.includes(element.value);
    } else if (this.isCheckbox) {
      if (typeof value === 'boolean') {
        element.checked = value;
      } else {
        element.checked = element.value === value;
      }
    } else {
      element.checked = element.value === value;
    }
  }

  ngAfterViewInit(): void {
    if (!this.elementType) return;

    const ngControl = this.injector.get(NgControl, null);
    if (ngControl) {
      this.control = ngControl.control;
      this.setHostName(ngControl.name);
      this.writeValue(this.control?.value);
      this.initialized = true;
    }
  }

  ngOnDestroy(): void {
    this.onChange = () => {};
    this.onTouched = () => {};
  }

  registerOnChange(fn: (value: any) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.renderer.setProperty(
      this.elementRef.nativeElement,
      'disabled',
      isDisabled
    );
  }

  private setHostName(name: any | null): void {
    if (name) {
      this.renderer.setProperty(this.elementRef.nativeElement, 'name', name);
    }
  }
}
