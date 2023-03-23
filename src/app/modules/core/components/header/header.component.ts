import { SearchStateRef } from './../../../../state/search/search.state';
import { searchProducts } from './../../../../state/search/search.actions';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { merge, observeOn, Subject, asyncScheduler, Subscription } from 'rxjs';
import { filter, map, Observable, skip } from 'rxjs';
import { BehaviorDistributor } from './../../../../utils/distributors';
import { animate, keyframes, state, style, transition, trigger } from '@angular/animations';
import { ChangeDetectionStrategy, Component, EventEmitter, inject, Output, ChangeDetectorRef, OnDestroy, HostListener } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { DetachView } from 'src/app/modules/shared/directives/detach-view.directive';
import { AuthUserModel } from 'src/app/state/auth/auth.state';
import { AppState } from 'src/app/state/app.state';
import { Store, select } from '@ngrx/store';
import { logout } from 'src/app/state/auth/auth.actions';
import { SearchItemModel } from 'src/app/state/search/search.state';

const dropdawnAnimationMetadata = trigger('dropdawn', [
  transition(':enter', [
    style({ opacity: 0, transform: 'scaleY(0)' }),
    animate('200ms', keyframes([
      style({ offset: .6,  opacity: 1, transform: 'scaleY(.7)'}),
      style({ offset: 1,  opacity: 1, transform: 'scaleY(1)', easing: 'cubic-bezier(0.33, 1, 0.68, 1)' })
    ]))
  ]),
  transition(':leave', [
    style({ opacity: 1, transform: 'scaleY(1)' }),
    animate('200ms', keyframes([
      style({ offset: .6,  opacity: 0, transform: 'scaleY(.7)'}),
      style({ offset: 1,  opacity: 0, transform: 'scaleY(0)', easing: 'cubic-bezier(0.33, 1, 0.68, 1)' })
    ]))
  ])
]);


const autocompleteAnimationMetadata = trigger('autocomplete', [
  transition(':enter', [
    style({ opacity: 0 }),
    animate('200ms', style({ opacity: 1, easing: 'cubic-bezier(0.33, 1, 0.68, 1)' }))
  ]),
  transition(':leave', [
    animate('200ms', style({ opacity: 0, height: 0}))
  ])
]);

@Component({
  selector: 'header[nutristore]',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { 'class': 'w-full max-w-[1200px] mx-auto' },
  hostDirectives: [
    DetachView,
  ],
  animations: [
    dropdawnAnimationMetadata,
    autocompleteAnimationMetadata
  ]
})
export class HeaderComponent implements OnDestroy {
  private _isOpen = false;
  private _subscription: Subscription;
  private _searchOpen = false;

  overlayOpen$: Observable<boolean>;
  authUser$: Observable<AuthUserModel | null>;
  itemsCount$: Observable<number>;
  isSearchResultsNotEmpty$: Observable<boolean>;
  results$: Observable<readonly SearchItemModel[]>;

  searchKey$ = new BehaviorSubject<string>('');
  backdropClick$ = new Subject<void>;
  triggerClick$ = new Subject<void>;
  onInputFocus$ = new Subject<string>;

  @Output() categoriesClick = new EventEmitter<void>();

  constructor(router: Router, private _store: Store<AppState>, searchStateRef: SearchStateRef) {

    this.overlayOpen$ = merge(
      router.events.pipe(
        filter((e) => e instanceof NavigationStart),
        skip(1),
        tap(() => this._isOpen = false)
      ),
      this.backdropClick$.pipe(observeOn(asyncScheduler), tap(() => this._isOpen = false)),
      this.triggerClick$.pipe(tap(() => this._isOpen = !this._isOpen))
    ).pipe(map(() => this._isOpen), distinctUntilChanged());

    this.authUser$ = _store.pipe(select(({ auth }) => auth.authUser));
    this.itemsCount$ = _store.pipe(select(({ cart }) => cart.items.length));
    this.results$ = _store.pipe(select(({ search }) => search.results));
    this.isSearchResultsNotEmpty$ = _store.pipe(
      select(({ search }) => search.results.length > 0),
      tap((value) => this._searchOpen = value)
    );

    this._subscription = this.searchKey$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
    ).subscribe((searchKey) => {
      _store.dispatch(searchProducts({ searchKey }));
    });

    this._subscription.add(merge(
      this.backdropClick$,
      router.events.pipe(filter((e) => e instanceof NavigationStart))
    ).pipe(debounceTime(0)).subscribe(() => _store.dispatch(searchProducts({ searchKey: '' }))));

  }

  onInputFocus(value: string): void {
    if (!this._searchOpen && value !== '') {
      this._store.dispatch(searchProducts({ searchKey: value }));
    }
  }

  onLogoutButtonClick(): void {
    this._store.dispatch(logout());
  }

  ngOnDestroy(): void {
    this._subscription.unsubscribe();
  }

}
