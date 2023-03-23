import { Subject } from 'rxjs';
import { RxStrategyProvider } from '@rx-angular/cdk/render-strategies';
import { Directive, ChangeDetectorRef, OnDestroy, HostListener } from '@angular/core';

@Directive({
  selector: '[appFormView]',
  standalone: true
})
export class FormViewDirective implements OnDestroy {

  private _trigger = new Subject<void>()

  constructor(cdRef: ChangeDetectorRef, rxStrategyProvider: RxStrategyProvider) {
    this._trigger.pipe(
      rxStrategyProvider.scheduleWith(() => cdRef.detectChanges(), { scope: cdRef })
    ).subscribe();
  }

  @HostListener('input')
  @HostListener('focusin')
  @HostListener('focusout')
  doCheck(): void {
    this._trigger.next();
  }

  ngOnDestroy(): void {
    this._trigger.complete();
  }

}
