import { Injectable, OnDestroy } from "@angular/core";
import { Observable, Subject, Subscription } from "rxjs";

export interface StateRef<T> {
  readonly onUpdate: Observable<unknown | void>;
  readonly state: T;
}

@Injectable({ providedIn: 'root' })
export abstract class BaseStateRef<T> implements StateRef<T>, OnDestroy {

  readonly onUpdate = new Subject<void>()
  private _state: T = null!
  get state(): T { return this._state };
  private _subscription: Subscription

  constructor(source: Observable<T>) {
    this._subscription = source.subscribe((state) => {
      if (this._state === state) { return; }
      this._state = state
      this.onUpdate.next();
    });

    if (this._state === null) {
      throw new Error('BaseStateRef#constructor: state not provided');
    }
  }

  ngOnDestroy(): void {
    this._subscription.unsubscribe();
  }
}

export enum StateStatus {
  pending = 'PENDING',
  empty = 'EMPTY',
  complete = 'COMPLETE',
  error = 'ERROR',
}

export enum AsyncActionStatus {
  awaiting = 'AWAITING',
  resolved = 'RESOLVED',
  rejected = 'REJECTED',
}
