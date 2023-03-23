import { isPlatformBrowser } from '@angular/common';
import * as categories from 'src/app/utils/products-categoires';

import { ChangeDetectionStrategy, Component, EventEmitter, Output, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { DetachView } from '../../../shared/directives/detach-view.directive';
import { fromEvent, Observable } from 'rxjs';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [ DetachView ],
  host: {
    'class': `fixed block top-0 left-0 w-[max-content] h-full z-10 mat-elevation-z3
              translate-x-[-100%] lg:static lg:translate-x-0 self-start lg:h-[min-content]
              mr-[16px] lg:py-[24px]`
    }
})
export class SidebarComponent  {
  readonly categories = categories;
  readonly overflowTrigger$: Observable<void | unknown>

  @Output() closeClick = new EventEmitter<void>();

  constructor(@Inject(PLATFORM_ID) private _platformId: object) {
    if (!isPlatformBrowser(this._platformId)) {
      this.overflowTrigger$ = new Observable()
      return;
    }

    this.overflowTrigger$ = fromEvent(window, 'resize');
  }
}
