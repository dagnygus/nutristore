import { OverlayRef, ScrollStrategy } from "@angular/cdk/overlay";
import { ScrollDispatcher, ViewportRuler } from "@angular/cdk/scrolling";
import { ApplicationRef, NgZone } from "@angular/core";
import { Subscription } from "rxjs";

declare const ngDevMode: unknown

type Dimensions = Omit<ClientRect, 'x' | 'y' | 'toJSON'>;

export function isElementScrolledOutsideView(element: Dimensions, scrollContainers: Dimensions[]) {
  return scrollContainers.some(containerBounds => {
    const outsideAbove = element.bottom < containerBounds.top;
    const outsideBelow = element.top > containerBounds.bottom;
    const outsideLeft = element.right < containerBounds.left;
    const outsideRight = element.left > containerBounds.right;

    return outsideAbove || outsideBelow || outsideLeft || outsideRight;
  });
}

export interface RepositionScrollStrategyConfig {
  /** Time in milliseconds to throttle the scroll events. */
  scrollThrottle?: number;

  /** Whether to close the overlay once the user has scrolled away completely. */
  autoClose?: boolean;
}

/**
 * Strategy that will update the element position as the user is scrolling.
 */
export class RxRepositionScrollStrategy implements ScrollStrategy {
  private _scrollSubscription: Subscription | null = null;
  private _overlayRef: OverlayRef = null!;

  constructor(
    private _scrollDispatcher: ScrollDispatcher,
    private _viewportRuler: ViewportRuler,
    private _ngZone: NgZone,
    private _appRef: ApplicationRef,
  ) {}

  /** Attaches this scroll strategy to an overlay. */
  attach(overlayRef: any) {
    if (this._overlayRef && (typeof ngDevMode === 'undefined' || ngDevMode)) {
      throw Error(`Scroll strategy has already been attached.`);
    }

    this._overlayRef = overlayRef;
  }

  /** Enables repositioning of the attached overlay on scroll. */
  enable() {
    if (!this._scrollSubscription) {

      requestAnimationFrame(() => this._overlayRef.updatePosition());

      this._scrollSubscription = this._scrollDispatcher.scrolled(0).subscribe(() => {
        this._overlayRef.updatePosition();

        const overlayRect = this._overlayRef.overlayElement.getBoundingClientRect();
        const { width, height } = this._viewportRuler.getViewportSize();

        const parentRects = [{width, height, bottom: height, right: width, top: 0, left: 0}];

        if (isElementScrolledOutsideView(overlayRect, parentRects)) {
          this.disable();
          this._overlayRef.detach();
          this._appRef.tick();
        }

      });
    }
  }

  /** Disables repositioning of the attached overlay on scroll. */
  disable() {
    if (this._scrollSubscription) {
      this._scrollSubscription.unsubscribe();
      this._scrollSubscription = null;
    }
  }

  detach() {
    this.disable();
    this._overlayRef = null!;
  }
}
