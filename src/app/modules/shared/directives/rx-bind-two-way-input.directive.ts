import { isPlatformBrowser } from '@angular/common';
import { Directive, ElementRef, HostBinding, HostListener, Inject, Input, OnDestroy, OnInit, PLATFORM_ID, Renderer2 } from "@angular/core";
import { Subject, Subscription } from "rxjs";

@Directive({ selector: 'input[rxBindTwoWayInput]' })
export class RxBindTwoWayInputDirective implements OnInit, OnDestroy {
  private _subscription: Subscription = null!;

  @Input() rxBindTwoWayInput!: Subject<string>;

  constructor(private _hostElementRef: ElementRef<HTMLInputElement>,
              @Inject(PLATFORM_ID) private _platformId: object) {}

  ngOnInit(): void {
    if (!isPlatformBrowser(this._platformId)) { return; }
    this._subscription = this.rxBindTwoWayInput.subscribe((value) => {
      if (value !== this._hostElementRef.nativeElement.value) {
        this._hostElementRef.nativeElement.value = value;
      }
    });
  }

  @HostListener('input')
  onInput(): void {
    this.rxBindTwoWayInput.next(this._hostElementRef.nativeElement.value);
  }

  ngOnDestroy(): void {
    if (!isPlatformBrowser(this._platformId)) { return; }
    this._subscription.unsubscribe();
  }
}
