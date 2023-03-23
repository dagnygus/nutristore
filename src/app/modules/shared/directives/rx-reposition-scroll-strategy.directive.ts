import { RxRepositionScrollStrategy } from '../scrolling/rx-overlay-scroll-strategy';
import { CdkConnectedOverlay } from '@angular/cdk/overlay';
import { ScrollDispatcher, ViewportRuler } from '@angular/cdk/scrolling';
import { ApplicationRef, Directive, NgZone, Self } from '@angular/core';
@Directive({ selector: '[rx-reposition-scroll-strategy]' })
export class RxRepositionScrollStrategyDirective {
  constructor(
    @Self() overlayDir: CdkConnectedOverlay,
    scrollDispatcher: ScrollDispatcher,
    viewportRuler: ViewportRuler,
    ngZone: NgZone,
    appRef: ApplicationRef,
  ) {
    overlayDir.scrollStrategy = new RxRepositionScrollStrategy(
      scrollDispatcher,
      viewportRuler,
      ngZone,
      appRef
    );
  }
}
