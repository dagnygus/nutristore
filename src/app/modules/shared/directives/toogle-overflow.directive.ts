import { isPlatformBrowser } from '@angular/common';
import { Directive, ElementRef, Inject, Input, OnDestroy, OnInit, PLATFORM_ID } from "@angular/core";
import { asyncScheduler, Observable, observeOn, Subscription } from "rxjs";

@Directive({ selector: '[toogleOverflow]' })
export class ToogleOverflowDirective implements OnDestroy {

  private _subscription: Subscription | null = null;

  @Input()
  public set toogleOverflow(trigger: Observable<void | unknown> | null) {
    if (!isPlatformBrowser(this._platformId)) { return; }
    if (!trigger) {
      this._subscription?.unsubscribe();
      return;
    }

    this._subscription?.unsubscribe();
    this._subscription = trigger.pipe(
      observeOn(asyncScheduler)
    ).subscribe(() => this._toogelOverflow());

    setTimeout(() => this._toogelOverflow());
  }

  constructor(private _elementRef: ElementRef<HTMLElement>, @Inject(PLATFORM_ID) private _platformId: object) {}


  ngOnDestroy(): void {
    this._subscription?.unsubscribe();
  }

  private _toogelOverflow() {
    const parent = this._elementRef.nativeElement;
    const child = parent.children.item(0)!

    if (child.clientHeight > parent.clientHeight) {
      parent.style.overflowY = 'scroll';
    } else {
      parent.style.overflowY = 'hidden';
    }
  }

}
