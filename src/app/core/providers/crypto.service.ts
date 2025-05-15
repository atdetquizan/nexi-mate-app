import { Inject, Injectable, InjectionToken, Optional } from '@angular/core';
import * as CryptoJS from 'crypto-js';

export interface ICryptoData {
  key: string;
}

export const ENCRYPT_DATA = new InjectionToken<ICryptoData>('encryptData', {
  providedIn: 'root',
  factory: () => ({} as ICryptoData),
});

@Injectable({
  providedIn: 'root',
})
export class CryptoService {
  /**
   * Creates an instance of CryptoService.
   * @param {ICryptoData | undefined} encryptData
   */
  public constructor(
    @Optional()
    @Inject(ENCRYPT_DATA)
    public encryptData: ICryptoData | undefined
  ) {}

  /**
   * Encrypts crypto service
   * @param {string} data
   * @returns CryptoJS.lib.CipherParams | string
   */
  public encrypt(data: string): CryptoJS.lib.CipherParams | string {
    if (this.encryptData) {
      return CryptoJS.AES.encrypt(data, this.encryptData.key);
    }
    return data;
  }

  /**
   * Decrypts crypto service
   * @param {string} data
   * @returns string
   */
  public decrypt(data: string): string {
    if (this.encryptData) {
      return CryptoJS.AES.decrypt(data, this.encryptData.key).toString(
        CryptoJS.enc.Utf8
      );
    }

    return data;
  }
}
