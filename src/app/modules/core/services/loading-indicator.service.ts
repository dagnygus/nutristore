import { Overlay, OverlayPositionBuilder, OverlayRef } from "@angular/cdk/overlay";
import { ComponentPortal } from "@angular/cdk/portal";
import { Injectable } from "@angular/core";
import { MatProgressSpinner } from "@angular/material/progress-spinner";

@Injectable({ providedIn: 'root' })
export class LoadingIndicatorService {
  private _overlayRef: OverlayRef | null = null;

  constructor(private _overlay: Overlay, private _positionBuilder: OverlayPositionBuilder) {}

  attach(): void {
    if (this._overlayRef) { return; }
    const overlayRef = this._overlayRef = this._overlay.create({
      hasBackdrop: true,
      positionStrategy: this._positionBuilder.global().centerHorizontally().centerVertically()
    });
    const componentRef = overlayRef.attach(new ComponentPortal(MatProgressSpinner));
    componentRef.instance.mode = 'indeterminate';
    componentRef.instance.color = 'accent';
    overlayRef.backdropElement!.style.touchAction = 'none';
    overlayRef.backdropElement?.addEventListener('wheel', this._onWheel);
    requestAnimationFrame(() => {
      overlayRef.updatePosition();
      componentRef.changeDetectorRef.detectChanges();
    })
  }

  detach(): void {
    if (!this._overlayRef) { return; }
    this._overlayRef.backdropElement!.style.touchAction = '';
    this._overlayRef.backdropElement!.removeEventListener('wheel', this._onWheel);
    this._overlayRef.detach();
    this._overlayRef.dispose();
    this._overlayRef = null;
  }

  private _onWheel(e: Event): void {
    e.preventDefault();
  }
}
