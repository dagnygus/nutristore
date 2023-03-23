import { AfterViewInit, Directive, ChangeDetectorRef } from '@angular/core';

@Directive({
  selector: '[appDetachView]',
  standalone: true,
})
export class DetachView implements AfterViewInit {

  constructor(private _cdRef: ChangeDetectorRef) { }

  ngAfterViewInit(): void {
    this._cdRef.detach()
  }

}
