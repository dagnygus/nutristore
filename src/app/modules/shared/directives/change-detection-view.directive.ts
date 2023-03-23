import { Directive, OnDestroy, TemplateRef, ViewContainerRef } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { RxStrategyProvider } from '@rx-angular/cdk/render-strategies';

export interface ChangeDetectionViewContext {
  $implicit: () => void;
}

@Directive({
  selector: '[changeDetectionView]'
})
export class ChangeDetectionViewDirective implements OnDestroy {

  private _triggerSubject = new Subject<void>()
  private _subscription: Subscription;

  constructor(viewContainerRef: ViewContainerRef,
              templateRef: TemplateRef<ChangeDetectionViewContext>,
              renderStrategyProvider: RxStrategyProvider) {
    const view = viewContainerRef.createEmbeddedView(templateRef, { $implicit: () => this._triggerSubject.next() });
    this._subscription = this._triggerSubject.pipe(
      renderStrategyProvider.scheduleWith(() => view.detectChanges(), { scope: view })
    ).subscribe();

    this._triggerSubject.next();
  }

  ngOnDestroy(): void {
    this._subscription.unsubscribe();
  }

  static ngTemplateContextGuard(dir: ChangeDetectionViewDirective, context: any): context is ChangeDetectionViewContext {
    return true;
  }

}
