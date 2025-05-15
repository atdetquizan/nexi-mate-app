import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { NgClass } from '@angular/common';
import { DialogService } from './providers';
import { DialogComponent } from './dialog.component';
import { DialogContentComponent } from '../dialog-content';
import { DialogDirective } from './directives';
import { ClickOutsideDirective } from '../../directives';

@NgModule({
  declarations: [DialogComponent],
  imports: [
    DialogContentComponent,
    NgClass,
    DialogDirective,
    ClickOutsideDirective,
  ],
  providers: [DialogService],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class DialogModule {}
