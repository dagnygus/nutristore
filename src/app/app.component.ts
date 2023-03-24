import { AppState } from 'src/app/state/app.state';
import { distinctUntilChanged, tap } from 'rxjs/operators';
import { animate, group, query, state, style, transition, trigger } from '@angular/animations';
import { Component } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { asyncScheduler, filter, map, merge, skip, Subject, subscribeOn, Observable, startWith } from 'rxjs';
import { DetachView } from './modules/shared/directives/detach-view.directive';
import { RouterOutletContainer } from './modules/shared/directives/router-outled-container.directive';
import { BreakpointObserver } from '@angular/cdk/layout'
import { select, Store } from '@ngrx/store';

const sidenavAnimationMetadata = trigger('sidenav', [
  state('true', style({ transform: 'translateX(0)' })),
  transition('false => true', animate('200ms', style({ transform: 'translateX(0)', easing: 'cubic-bezier(0.33, 1, 0.68, 1)' }))),
  transition('true => false', animate('200ms', style({ transform: 'translateX(-100%)', easing: 'cubic-bezier(0.32, 0, 0.67, 0)' })))
]);

const backdropAnimationMetadata = trigger('backdrop', [
  transition(':enter', [
    style({ opacity: 0 }),
    animate('200ms', style({ opacity: 1, easing: 'cubic-bezier(0.33, 1, 0.68, 1)' }))
  ]),
  transition(':leave', [
    style({ opacity: 1 }),
    animate('200ms', style({ opacity: 0, easing: 'cubic-bezier(0.32, 0, 0.67, 0)' }))
  ])
]);

const outletContainerAnimationMetadata = trigger('outletContainer',[
  transition('* <=> *, void => *', [
    group([
      query(':enter', [
        style({ opacity: 0, transform: 'scale(.8)' }),
        animate('600ms', style({ opacity: 1, transform: 'scale(1)' , easing: 'cubic-bezier(0.33, 1, 0.68, 1)' }))
      ], { optional: true }),
      query(':leave', [
        style({ opacity: 1 }),
        animate('600ms', style({ opacity: 0, transform: 'scale(.8)', easing: 'cubic-bezier(0.32, 0, 0.67, 0' }))
      ], { optional: true }),
    ])
  ])
]);

const mainContentAnimationMetadata = trigger('mainContent', [
  state('false', style({ transform: 'translateX(0)' })),
  state('true', style({ transform: 'translateX(18%)' })),
  transition('false => true', animate('200ms', style({ transform: 'translateX(18%)', easing: 'cubic-bezier(0.33, 1, 0.68, 1)' }))),
  transition('true => false', animate('200ms', style({ transform: 'translateX(0)', easing: 'cubic-bezier(0.32, 0, 0.67, 0)' })))
]);

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [
    sidenavAnimationMetadata,
    backdropAnimationMetadata,
    mainContentAnimationMetadata,
    outletContainerAnimationMetadata
  ],
  hostDirectives: [
    DetachView,
    RouterOutletContainer,
  ],
})
export class AppComponent {
  readonly sidenavOpen$: Observable<boolean>;
  readonly fullPath$: Observable<string | null>;
  readonly openSidenav$ = new Subject<void>();
  readonly closeSidenav$ = new Subject<void>();

  constructor(router: Router,
              breakpointObserver: BreakpointObserver,
              store: Store<AppState>) {
    this.sidenavOpen$ = merge(
      router.events.pipe(
        filter((e) => e instanceof NavigationStart),
        map(() => false),
        subscribeOn(asyncScheduler),
        tap(console.log)
      ),
      breakpointObserver.observe('(min-width:1024px)').pipe(
        skip(1),
        map((state) => !state.matches),
        filter((value) => !value)
      ),
      this.openSidenav$.pipe(map(() => true)),
      this.closeSidenav$.pipe(map(() => false)),
    ).pipe(startWith(false), distinctUntilChanged());

    this.fullPath$ = store.pipe(
      select(({ router }) => router?.state.fullPath ?? null),
    );
  }

  title = 'nutristore';
}
