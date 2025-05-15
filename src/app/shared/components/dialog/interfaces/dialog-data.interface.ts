import { Type } from "@angular/core";
import { DialogConfig } from "../core/dialog-config";

export interface DialogData<T, D = any> {
    component?: Type<T>;
    config?: DialogConfig<D>;
}