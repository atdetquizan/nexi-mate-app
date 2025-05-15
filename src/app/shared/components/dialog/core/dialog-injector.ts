import { Injector } from '@angular/core';

export class DialogInjector {
  /**
   * Creates an instance of roblex injector.
   * @param _parentInjector Injector
   * @param _additionalTokens WeakMap<any, any>
   */
  public constructor(
    public _parentInjector: Injector,
    public _additionalTokens: WeakMap<any, any>
  ) {}
  /**
   * Gets neyhaz modal injector
   * @param {any} token
   * @param {any | undefined} notFoundValue
   * @returns any
   */
  public get(token: any, notFoundValue?: any) {
    const value = this._additionalTokens.get(token);

    if (value) {
      return value;
    }

    return this._parentInjector.get<any>(token, notFoundValue);
  }
}
