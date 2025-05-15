import {
  AfterViewInit,
  Component,
  ComponentRef,
  inject,
  input,
  OnDestroy,
  Type,
  ViewChild,
} from '@angular/core';
import { DialogDirective } from './directives';
import { DialogConfig, DialogRef } from './core';
import { LoggerService } from '../../../core/providers';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrl: './dialog.component.scss',
  standalone: false
})
export class DialogComponent implements OnDestroy, AfterViewInit {
  uniqueKey = input<number>();
  component = input<Type<unknown>>();
  config = input<DialogConfig<unknown>>();
  dialogRef = inject(DialogRef);
  logger = inject(LoggerService);

  /**
   * View child of dynamic modal component
   */
  @ViewChild(DialogDirective, { static: true }) insertion!: DialogDirective;

  /**
   * Component ref of dialog main component
   */
  public componentRef?: ComponentRef<unknown>;

  /**
   * On destroy
   */
  public ngOnDestroy(): void {
    this.logger.debug('DialogComponent destroyed:', [this, this.uniqueKey]);
    if (this.componentRef) {
      this.componentRef.destroy();
    }
  }

  /**
   * After view init
   */
  public ngAfterViewInit(): void {
    const component = this.component();
    if (component) {
      this.loadChildComponent(component);
    }
  }

  /**
   * Determines whether click closed on
   */
  public onClickOutside() {
    const { backdrop } = this.config() ?? {}
    if (backdrop) {
      this.dialogRef.close();
    }
  }

  /**
   * Loads child component
   * @param {Type<unknown>} componentType
   */
  public loadChildComponent(componentType: Type<unknown>): void {
    const viewContainerRef = this.insertion.viewContainerRef;

    viewContainerRef.clear();

    this.componentRef = viewContainerRef.createComponent(componentType);
  }
}
