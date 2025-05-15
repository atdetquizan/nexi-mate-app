import { Inject, inject, Injectable } from '@angular/core';
import { CryptoService } from './crypto.service';
import { DOCUMENT } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  /**
   * Storage  of storage service
   */
  storage?: Storage;

  /**
   * Crypto service of storage service
   */
  cryptoService = inject(CryptoService);

  constructor(@Inject(DOCUMENT) private document: Document) {
    const window = this.document.defaultView;
    if (window) {
      this.storage = window.sessionStorage;
    }
  }

  /**
   * Sets storage service
   * @template T
   * @param {string} key
   * @param {T} value
   */
  set<T>(key: string, value: T) {
    const encryptMessage = this.cryptoService.encrypt(
      typeof value !== 'string' ? JSON.stringify(value) : value
    );

    this.storage?.setItem(key, encryptMessage.toString());
  }

  /**
   * Gets storage service
   * @template T
   * @param {StorageNameType | string} key
   * @returns T | null
   */
  get<T>(key: string): T | null {
    const sessionStorageData = this.storage?.getItem(key);

    if (sessionStorageData) {
      const value = this.cryptoService.decrypt(sessionStorageData);
      try {
        const decryptMessage = JSON.parse(value);
        return decryptMessage as T;
      } catch (error) {
        return value as T;
      }
    }

    return null;
  }

  /**
   * Removes storage service
   * @param {string} key
   */
  remove(key: string) {
    this.storage?.removeItem(key);
  }

  /**
   * Clears storage service
   */
  clear() {
    this.storage?.clear();
  }
}
