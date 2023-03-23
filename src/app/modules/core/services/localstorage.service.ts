/* eslint-disable @typescript-eslint/member-ordering */
import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { Inject, Injectable, NgZone, PLATFORM_ID } from '@angular/core';
import { Subject } from 'rxjs';
import { Observable } from 'rxjs';

export interface DecodedToken {
  userid: string;
  email: string;
  rolename: string;
  iat: number;
  exp: number;
}


@Injectable({ providedIn: 'root' })
export class LocalStorageService {

  constructor() {}

  setItem<T extends object>(name: string, item: T): void {
    if (typeof localStorage === 'undefined') { return; }
    localStorage.setItem(name, JSON.stringify(item));
  }

  getItem<T>(name: string): T | null {
    if (typeof localStorage === 'undefined') { return null; }
    const itemStr = localStorage.getItem(name);
    return itemStr === null ? null : JSON.parse(itemStr) ;
  }

  removeItem(name: string): void {
    if (typeof localStorage === 'undefined') { return; }
    localStorage.removeItem(name);
  }


}
