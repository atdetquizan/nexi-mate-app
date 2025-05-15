import { Observable, Subject } from 'rxjs';
import { LoggerService } from '../../../../core/providers';

export class DialogRef<T = unknown> {
  /**
   * After closed of neyhaz modal ref
   */
  public afterClosed: Observable<T | undefined>;

  public logger: LoggerService;
  /**
   * After closed of neyhaz modal ref
   */
  private readonly _afterClosed = new Subject<T | undefined>();
  /**
   * Creates an instance of neyhaz modal ref.
   */
  public constructor(public name: string, logger: LoggerService) {
    this.logger = logger;
    logger.debug('DialogRef creado:', name, this);
    this.afterClosed = this._afterClosed.asObservable();
  }
  /**
   * Closes janus alert ref
   * @template T
   * @param [result] T
   */
  public close(result?: T) {
    this.logger.debug('DialogRef.close() llamado:', this.name, this);
    this._afterClosed.next(result);
  }
}
