import { RxStrategyProvider } from '@rx-angular/cdk/render-strategies';
import { AfterViewInit, ChangeDetectorRef, Directive, OnDestroy, Self } from "@angular/core";
import { asyncScheduler, Observable, observeOn, Subscription, filter, debounceTime } from 'rxjs';

@Directive({ selector: '[cdConnector]', standalone: true })
export class CdConnector implements OnDestroy, AfterViewInit {
  private _subscription = new Subscription()
  private _init = false;

  constructor (private _strategyProvider: RxStrategyProvider, @Self() private _cd: ChangeDetectorRef) { }

  connect(source: Observable<void | unknown>, async: boolean = true): void {
    if (async) {
      this._subscription.add(source.pipe(
        filter(() => this._init),
        debounceTime(0),
        this._strategyProvider.scheduleWith(() => this._cd.detectChanges(), { scope: this._cd }),
      ).subscribe());
    } else {
      this._subscription.add(source.pipe(
        filter(() => this._init),
        this._strategyProvider.scheduleWith(() => this._cd.detectChanges(), { scope: this._cd }),
      ).subscribe());
    }

  }

  ngOnDestroy(): void {
    this._subscription.unsubscribe()
  }

  ngAfterViewInit(): void {
    this._init = true
  }
}
