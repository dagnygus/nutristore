import { takeUntil, takeWhile, delay, animationFrameScheduler } from 'rxjs';
import { merge, observeOn, of, startWith, Subject, take, tap, asyncScheduler } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { SearchItemModel } from 'src/app/state/search/search.state';
import { fromEvent, map, Observable, Subscription } from 'rxjs';
import { ChangeDetectionStrategy, Component, Inject, Input, OnInit, PLATFORM_ID, ElementRef, OnDestroy, OnChanges, ChangeDetectorRef, HostListener, EventEmitter, Output } from '@angular/core';
import { animateElement } from 'src/app/utils/animation-helper';
import { DetachView } from 'src/app/modules/shared/directives/detach-view.directive';

@Component({
  selector: 'app-autocomplete',
  templateUrl: './autocomplete.component.html',
  styleUrls: ['./autocomplete.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [DetachView],
  host: { 'class': 'bg-blue-grey-400 text-[12px] text-white rounded-[6px] mat-elevation-z4 overflow-hidden' },
})
export class AutocompleteComponent implements OnInit, OnDestroy {

  private _subscription: Subscription = null!;
  private _selectedIndex = -1;

  overflowTrigger$: Observable<void | unknown> = null!;
  renderCb$ = new Subject<any>()

  @Input() results$: Observable<readonly SearchItemModel[]> = null!
  @Input() originContainer: HTMLElement = null!;


  constructor(@Inject(PLATFORM_ID) private _platformId: object,
              private _hostElementRef: ElementRef<HTMLElement>) {}

  ngOnInit(): void {
    if (!isPlatformBrowser(this._platformId)) {
      this.overflowTrigger$ = new Observable();
      return;
    }

    this._subscription = fromEvent(window, 'resize').pipe(
      map(() => this.originContainer.getBoundingClientRect().width),
      startWith(this.originContainer.getBoundingClientRect().width)
    ).subscribe((width) => this._hostElementRef.nativeElement.style.width = `${width}px`);

    this.overflowTrigger$ = merge(
      fromEvent(window, 'resize'),
      this.results$
    );

    let currentHeight: number = 0;

    this._subscription.add(this.results$.subscribe(() => currentHeight = this._hostElementRef.nativeElement.clientHeight));
    this._subscription.add(this.renderCb$.subscribe(() => {
      this._selectedIndex = -1;
      const targetHeight = this._hostElementRef.nativeElement.clientHeight + 'px';
        this._hostElementRef.nativeElement.animate([
          { height: currentHeight + 'px' },
          { height: targetHeight }
        ], { easing: 'cubic-bezier(0.33, 1, 0.68, 1)', duration: 200 });
    }));


  }

  @HostListener('window:keydown', [ '$event' ])
  onWindowKeyDawn(event: KeyboardEvent): void {
    const listElement = this._hostElementRef.nativeElement.querySelector('ul') as HTMLUListElement;
    if (listElement.children.length === 0) { return; }
    if (event.key === 'ArrowDown' && listElement.children.length - 1 > this._selectedIndex) {
      event.preventDefault();
      this._selectedIndex++;
      (listElement.children.item(this._selectedIndex)!.firstElementChild as HTMLElement).focus();
    } else if (event.key === 'ArrowUp' && this._selectedIndex > -1) {
      event.preventDefault();
      this._selectedIndex--;
      if (this._selectedIndex > -1) {
        (listElement.children.item(this._selectedIndex)!.firstElementChild as HTMLElement).focus();
      } else {
        this.originContainer.querySelector('input')!.focus();
      }
    } else if (event.key === 'Enter' && this._selectedIndex > -1) {
      event.preventDefault();
      (listElement.children.item(this._selectedIndex)!.firstElementChild as HTMLElement).click();
    } else {

    }
  }


  ngOnDestroy(): void {
    if (!isPlatformBrowser(this._platformId)) { return; }
    this._subscription.unsubscribe();
  }
}
