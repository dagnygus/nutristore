import { coerceNumberInput } from './../../../utils/coerction-and-types';
import { WindowScroller, WindowScrollerOptions } from 'src/app/modules/core/services/window-scroller';
import { Directive, ElementRef, HostListener, Input } from "@angular/core";
import { NumberInput } from 'src/app/utils/coerction-and-types';

@Directive({ selector: '[scrollOnClick]' })
export class ScrollOnClickDirectice {

  @Input() scrollOnClick: ElementRef<Element> | Element | string | null = null;

  @Input() scrollMinDur?: NumberInput;
  @Input() scrollMaxDur?: NumberInput;
  @Input() scrollDelay?: NumberInput;
  @Input() scrollSpeed?: NumberInput;
  @Input() scrollTargetSide?: 'top' | 'bottom';
  @Input() addOffsetToScroll?: NumberInput;


  constructor(private _scroller: WindowScroller) {}

  @HostListener('click')
  onClick(): void {
    if (!this.scrollOnClick) { return; }
    const options = this._getOptions();
    this._scroller.scroll(this.scrollOnClick, options);
  }

  private _getOptions(): WindowScrollerOptions {
    const minDur = this.scrollMinDur && coerceNumberInput(this.scrollMinDur);
    const maxDur = this.scrollMaxDur && coerceNumberInput(this.scrollMaxDur);
    const delay = this.scrollDelay && coerceNumberInput(this.scrollDelay);
    const side = this.scrollTargetSide ?? 'top';
    const addOffset = this.addOffsetToScroll && coerceNumberInput(this.addOffsetToScroll);

    return { minDur, maxDur, delay, side, addOffset }
  }
}
