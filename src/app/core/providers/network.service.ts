import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, fromEvent, map, merge, startWith } from 'rxjs';

/**
 * Servicio para gestionar el estado de la red y la navegación basada en la conectividad.
 * @class NetworkService
 * @description Escucha los cambios en el estado de la red y navega a rutas específicas según la conectividad.
 */
@Injectable({
  providedIn: 'root'
})
export class NetworkService {
  /** @private {PLATFORM_ID} Identificador del entorno de ejecución */
  private readonly platformId = inject(PLATFORM_ID);

  /** @private {BehaviorSubject<boolean>} Sujeto para el estado de conexión en línea */
  private readonly onlineSubject = new BehaviorSubject<boolean>(true);

  /** @public {Observable<boolean>} Observable para el estado de conexión en línea */
  public readonly online$ = this.onlineSubject.asObservable();

  /** @private {Router} Servicio de enrutamiento para navegar entre rutas */
  private router = inject(Router);

  /**
   * Constructor de la clase NetworkService.
   * Inicializa la escucha de cambios en el estado de la red solo en el navegador.
   */
  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this.listenToNetwork();
      this.listenToVisibility();
    }
  }

  /**
   * Escucha los eventos de cambio de estado de la red y actualiza el sujeto online.
   * Solo se activa si la página está visible.
   * @private
   */
  private listenToNetwork() {
    const offline$ = fromEvent(window, 'offline').pipe(map(() => false));
    const online$ = fromEvent(window, 'online').pipe(map(() => true));

    merge(offline$, online$)
      .pipe(startWith(navigator.onLine))
      .subscribe((isOnline) => {
        if (document.visibilityState === 'visible') {
          this.handleNetworkChange(isOnline);
        }
      });
  }

  /**
   * Monitorea la visibilidad de la pestaña y verifica el estado de la red.
   * @private
   */
  private listenToVisibility() {
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        this.checkConnection();
      }
    });
  }

  /**
   * Verifica manualmente el estado de la conexión y navega si es necesario.
   * @private
   */
  private checkConnection() {
    const isOnline = navigator.onLine;
    this.handleNetworkChange(isOnline);
  }

  /**
   * Maneja el cambio de estado de la red.
   * @private
   * @param isOnline Estado de la conexión (true: conectado, false: desconectado).
   */
  private handleNetworkChange(isOnline: boolean) {
    this.onlineSubject.next(isOnline);
    if (!isOnline) {
      this.router.navigate(['/without-internet-connection']);
    } else {
      if (this.router.url === '/without-internet-connection') {
        this.router.navigate(['/']);
      }
    }
  }
}
