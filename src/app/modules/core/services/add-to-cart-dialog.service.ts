import { AddToCartDialogComponent } from './../../shared/components/add-to-cart-dialog/add-to-cart-dialog.component';
import { Overlay, OverlayPositionBuilder, OverlayRef } from "@angular/cdk/overlay";
import { ComponentRef, Injectable, NgZone } from "@angular/core";
import { ComponentPortal } from '@angular/cdk/portal';
import { take } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AddToCartService {
  private _overlayRef: OverlayRef | null = null;
  private _componentRef: ComponentRef<AddToCartDialogComponent> | null = null;

  constructor(private _overlay: Overlay, private _positionBuilder: OverlayPositionBuilder, private ngZone: NgZone) {}

  open(productName: string): void {
    if (this._overlayRef) { return; }
    const overlayRef = this._overlayRef = this._overlay.create({
      hasBackdrop: true,
      positionStrategy: this._positionBuilder.global().centerHorizontally().centerVertically()
    })

    const onWheel = (e: Event) => e.preventDefault();

    const componentRef = this._componentRef = this._overlayRef.attach(new ComponentPortal(AddToCartDialogComponent));
    componentRef.instance.productName$.next(productName);
    overlayRef.backdropElement!.style.touchAction = 'none';
    overlayRef.backdropElement!.addEventListener('wheel', onWheel);

    componentRef.instance.onLeavedDone.pipe(
      take(1),
    ).subscribe(() => {
      overlayRef.dispose();
    })

    componentRef.instance.onClose.pipe(
      take(1)
    ).subscribe(() => {
      overlayRef.backdropElement!.style.touchAction = '';
      overlayRef.backdropElement!.removeEventListener('wheel', onWheel);
      overlayRef.detach();
      componentRef.changeDetectorRef.detectChanges();
      // overlayRef.dispose();
      this._overlayRef = null;
      this._componentRef = null;
    });

    requestAnimationFrame(() => {
      // componentRef.changeDetectorRef.markForCheck();
      // this.ngZone.onMicrotaskEmpty.emit();
      // this.ngZone.onStable.emit();
      overlayRef.updatePosition();
      componentRef.changeDetectorRef.detectChanges();
    });
  }

  close(): void {
    if (!this._componentRef) { return; }
    this._componentRef.instance.onClose.next();
  }
}
