import { ChangeDetectorRef, Directive, OnDestroy } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter, Subscription } from 'rxjs';

@Directive({
  selector: '[routerOutlateContainer]',
  standalone: true,
})
export class RouterOutletContainer implements OnDestroy {
  private _subscription: Subscription;

  constructor(router: Router, cd: ChangeDetectorRef) {
    this._subscription = router.events.pipe(
      filter((e) => e instanceof NavigationEnd),
    ).subscribe(() => cd.detectChanges());
  }

  ngOnDestroy(): void {
    this._subscription.unsubscribe();
  }
}
