import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import {
  ApplicationRef,
  ComponentRef,
  createComponent,
  EmbeddedViewRef,
  inject,
  Inject,
  Injectable,
  Injector,
  PLATFORM_ID,
} from '@angular/core';
import { DialogComponent } from '../dialog.component';
import { DialogData } from '../interfaces';
import { DialogConfig, DialogInjector, DialogRef } from '../core';
import { LoggerService } from '../../../../core/providers';

@Injectable({
  providedIn: 'root',
})
export class DialogService {
  /**
   * Logger  of dialog service
   */
  logger = inject(LoggerService);
  /**
   * Create  of dialog service
   */
  create = createComponent;

  /**
   * Child unique key of dialog service
   */
  childUniqueKey = 0;

  /**
   * Components references of dialog service
   */
  componentsReferences = Array<ComponentRef<DialogComponent>>();

  /**
   * Creates an instance of dialog service.
   * @param injector Injector
   * @param appRef ApplicationRef
   * @param document
   */
  constructor(
    private injector: Injector,
    private appRef: ApplicationRef,
    @Inject(PLATFORM_ID) private platformId: Object,
    @Inject(DOCUMENT) private document?: Document
  ) {}

  /**
   * Shows dialog service
   * @template T
   * @param {DialogData<T>} data
   * @returns DialogRef<unknown>
   */
  show<T, U = unknown>(data: DialogData<T>): DialogRef<U> {
    data = {
      ...data,
      config: Object.assign(
        { backdrop: true, buttons: { isAccept: true, isExit: true } },
        data.config
      ),
    };

    const dialogRef = this.appendComponent<T, U>(data);

    return dialogRef;
  }

  /**
   * Appends component
   * @template T
   * @param config DialogConfig
   * @param [componentType] Type<T>
   * @returns DialogRef<unknown>
   */
  appendComponent<T, U>(data: DialogData<T>) {
    const { dialogRef, componentRef } = this.componentRef<U>(
      data.config as DialogConfig<U>
    );

    this.childComponentType<T>(componentRef, data);

    const sub = dialogRef.afterClosed.subscribe(() => {
      this.removeElement(componentRef);
      sub.unsubscribe();
    });

    this.appRef.attachView(componentRef.hostView);
    this.componentsReferences.push(componentRef);
    if (isPlatformBrowser(this.platformId)) {
      this.document?.body?.append(
        (<EmbeddedViewRef<any>>componentRef.hostView).rootNodes[0]
      );
    }

    return dialogRef;
  }

  /**
   * Components ref
   * @template T
   * @param config DialogConfig<T>
   * @returns ref ComponentRef<DialogMainComponent>
   */
  componentRef<T>(config: DialogConfig<T>): {
    dialogRef: DialogRef<T>;
    componentRef: ComponentRef<DialogComponent>;
  } {
    const map = new WeakMap();

    map.set(DialogConfig<T>, config);

    const dialogName = `Modal-${++this.childUniqueKey}`;
    const dialogRef = new DialogRef<T>(dialogName, this.logger);

    map.set(DialogRef<T>, dialogRef);

    const componentRef = this.create(DialogComponent, {
      elementInjector: new DialogInjector(this.injector, map),
      environmentInjector: this.appRef.injector,
    });

    return { dialogRef, componentRef };
  }

  /**
   * Childs component type
   * @template T
   * @param componentRef ComponentRef<DialogMainComponent>
   * @param [componentType] Type<T>
   * @returns DialogMainComponent
   */
  childComponentType<T>(
    componentRef: ComponentRef<DialogComponent>,
    data: DialogData<T>
  ): DialogComponent {
    const { component, config } = data;

    componentRef.setInput('uniqueKey', ++this.childUniqueKey);
    componentRef.setInput('config', config);

    if (component) {
      componentRef.setInput('component', component);
    }

    return componentRef.instance;
  }

  /**
   * Removes element
   * @param componentRef ComponentRef<DialogMainComponent> | undefined
   */
  removeElement(componentRef: ComponentRef<DialogComponent> | undefined): void {
    if (componentRef) {
      const modalViewRef = (<EmbeddedViewRef<any>>componentRef.hostView)
        .rootNodes[0] as HTMLElement | undefined;

      if (modalViewRef) {
        //  const dialog = modalViewRef.querySelector(
        //    '.kingslanding-modal-content'
        //  );

        //  dialog?.classList.add('kingslanding-modal-removed');

        // eslint-disable-next-line
        //  const animationend = (e: any) => {
        //    if (e.animationName.indexOf('dialogBounceOut')) {
        this.appRef.detachView(componentRef.hostView);
        componentRef.destroy();

        modalViewRef.remove();
        //    }
        //  };

        //  this.document.body.addEventListener(
        //    'animationend',
        //    animationend,
        //    false
        //  );

        //  this.document.body.addEventListener(
        //    'webkitAnimationEnd',
        //    animationend,
        //    false
        //  );
      }
    }
  }
}
