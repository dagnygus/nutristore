import { ChangeDetectorRef, InjectionToken } from '@angular/core';
import { Directive } from '@angular/core';

export interface TargetToCheck {
  changeDetectorRef: ChangeDetectorRef
}

export const TARGET_TO_CHECK = new InjectionToken<TargetToCheck>('TARGET_TO_CHECK');

@Directive({
  selector: '[targetToCheck]',
  providers: [{ provide: TARGET_TO_CHECK, useExisting: TargetToCheckDirective }],
  standalone: true
})
export class TargetToCheckDirective implements TargetToCheck {
  constructor(public changeDetectorRef: ChangeDetectorRef) {}
}

