import { RxStrategyProvider } from '@rx-angular/cdk/render-strategies';
import { ChangeDetectorRef, Directive, HostListener, Inject, OnDestroy, Optional } from "@angular/core";
import { asyncScheduler, observeOn, Subject, Subscription } from "rxjs";
import { TargetToCheck, TARGET_TO_CHECK } from './check-source.directive';

@Directive({ selector: '[triggerCheckOnClick]' })
export class TriiggerCheckOnClick implements OnDestroy {
  private _subscription: Subscription
  private _onClick$ = new Subject<void>();
  constructor(strategyProvider: RxStrategyProvider,
              cdRef: ChangeDetectorRef,
              @Optional() @Inject(TARGET_TO_CHECK) target: TargetToCheck | null) {
    if (target) {
      this._subscription = this._onClick$.pipe(
        strategyProvider.scheduleWith(() => target.changeDetectorRef.detectChanges(), { scope: target.changeDetectorRef })
      ).subscribe();
    } else {
      this._subscription = this._onClick$.pipe(
        strategyProvider.scheduleWith(() => cdRef.detectChanges(), { scope: cdRef })
      ).subscribe();
    }

  }

  @HostListener('click')
  onClick(): void {
    this._onClick$.next();
  }

  ngOnDestroy(): void {
    this._subscription.unsubscribe();
  }
}
