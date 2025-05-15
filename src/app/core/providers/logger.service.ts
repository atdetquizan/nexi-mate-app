import { Inject, Injectable, InjectionToken, Optional } from '@angular/core';

/**
 * Configuración para el LoggerService.
 * @interface
 */
export interface ILoggerConfig {
  /** Indica si el logger está habilitado. */
  isEnabled: boolean;
  /** Prefijo opcional para los mensajes del logger. */
  prefix?: string;
}

/**
 * Token de inyección para la configuración del logger.
 */
export const LOGGER_CONFIG = new InjectionToken<ILoggerConfig>('loggerConfig', {
  providedIn: 'root',
  factory: () => ({ isEnabled: true }),
});

/**
 * Servicio para el registro de logs en la aplicación.
 * Permite controlar el nivel y formato de los mensajes de log.
 * @export
 */
@Injectable({
  providedIn: 'root',
})
export class LoggerService {
  /**
   * Indica si el logger está habilitado.
   * @private
   */
  private isEnabled: boolean;

  /**
   * Prefijo para los mensajes del logger.
   * @private
   */
  private prefix: string;

  /**
   * Crea una nueva instancia de LoggerService.
   * @param {ILoggerConfig} config Configuración opcional para el logger.
   */
  constructor(
    @Optional()
    @Inject(LOGGER_CONFIG)
    config: ILoggerConfig
  ) {
    this.isEnabled = config?.isEnabled ?? true;
    this.prefix = config?.prefix ?? 'Logger';
  }

  /**
   * Habilita el logger.
   * @public
   */
  enable(): void {
    this.isEnabled = true;
  }

  /**
   * Deshabilita el logger.
   * @public
   */
  disable(): void {
    this.isEnabled = false;
  }

  /**
   * Registra un mensaje de tipo log.
   * @param {...unknown[]} args Argumentos a registrar.
   * @public
   */
  log(...args: unknown[]): void {
    if (this.isEnabled) {
      console.log(...this.formatMessage('LOG', ...args));
    }
  }

  /**
   * Registra un mensaje de tipo error.
   * @param {...unknown[]} args Argumentos a registrar.
   * @public
   */
  error(...args: unknown[]): void {
    if (this.isEnabled) {
      console.error(...this.formatMessage('ERROR', ...args));
    }
  }

  /**
   * Registra un mensaje de tipo advertencia.
   * @param {...unknown[]} args Argumentos a registrar.
   * @public
   */
  warn(...args: unknown[]): void {
    if (this.isEnabled) {
      console.warn(...this.formatMessage('WARN', ...args));
    }
  }

  /**
   * Registra un mensaje de tipo información.
   * @param {...unknown[]} args Argumentos a registrar.
   * @public
   */
  info(...args: unknown[]): void {
    if (this.isEnabled) {
      console.info(...this.formatMessage('INFO', ...args));
    }
  }

  /**
   * Registra un mensaje de tipo debug.
   * @param {...unknown[]} args Argumentos a registrar.
   * @public
   */
  debug(...args: unknown[]): void {
    if (this.isEnabled) {
      console.debug(...this.formatMessage('DEBUG', ...args));
    }
  }

  /**
   * Da formato a los mensajes de log.
   * @param {string} level Nivel del mensaje.
   * @param {...unknown[]} args Argumentos a formatear.
   * @returns {unknown[]} Mensaje formateado.
   * @private
   */
  private formatMessage(level: string, ...args: unknown[]): unknown[] {
    const color = this.getColor(level);
    return [`%c[${this.prefix} - ${level}]`, `color: ${color}; font-weight: bold;`, ...args];
  }

  /**
   * Obtiene el color correspondiente al nivel del mensaje.
   * @param {string} level Nivel del mensaje.
   * @returns {string} Color CSS.
   * @private
   */
  private getColor(level: string): string {
    switch (level) {
      case 'ERROR':
        return 'red';
      case 'WARN':
        return 'orange';
      case 'INFO':
        return 'blue';
      case 'DEBUG':
        return 'purple';
      default:
        return 'black';
    }
  }
}
