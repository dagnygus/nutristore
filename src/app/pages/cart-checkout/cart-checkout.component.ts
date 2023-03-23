import { LoadingIndicatorService } from './../../modules/core/services/loading-indicator.service';
import { CheckoutPeymantComponent } from './components/checkout-peymant/checkout-peymant.component';
import { TargetToCheckDirective } from './../../modules/shared/directives/check-source.directive';
import { CheckoutAddressComponent } from './components/checkout-address/checkout-address.component';
import { CartItemModel } from './../../state/cart/cart.state';
import { ChangeDetectionStrategy, Component, ChangeDetectorRef, ViewEncapsulation } from '@angular/core';
import { SharedModule } from 'src/app/modules/shared/shared.module';
import { DetachView } from 'src/app/modules/shared/directives/detach-view.directive';
import { select, Store } from '@ngrx/store';
import { AppState } from 'src/app/state/app.state';
import { filter, map, Observable, Subject, take, BehaviorSubject, subscribeOn, asyncScheduler, of, startWith, tap } from 'rxjs';
import { AuthUserModel } from 'src/app/state/auth/auth.state';
import { CheckoutItemsListComponent } from './components/checkout-items-list/checkout-items-list.component';
import { WindowScroller } from 'src/app/modules/core/services/window-scroller';
import { CheckoutSummaryComponent } from './components/checkout-summary/checkout-summary.component';
import { CartEvents } from 'src/app/state/cart/cart.effects';
import { AsyncActionStatus } from 'src/app/state/app.state.utils';
import { makeOrder } from 'src/app/state/cart/cart.actions';

export interface AddressData {
  city: string;
  street: string;
  state: string;
  country: string;
}

@Component({
  selector: 'app-cart-checkout',
  standalone: true,
  imports: [SharedModule, CheckoutItemsListComponent, CheckoutAddressComponent, CheckoutSummaryComponent, CheckoutPeymantComponent],
  hostDirectives: [ DetachView, TargetToCheckDirective ],
  templateUrl: './cart-checkout.component.html',
  styleUrls: ['./cart-checkout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { 'class': 'text-white bg-transparent-blue-grey backdrop-blur-sm min-h-[80vh] page' },
  encapsulation: ViewEncapsulation.None
})
export class CartCheckoutComponent {
  cartList$: Observable<readonly CartItemModel[]>
  authUser$: Observable<AuthUserModel>;
  totalPrice$: Observable<string>;
  addressData$: Observable<AddressData>;
  userHaveItems$: Observable<boolean>;

  changeData$ = new BehaviorSubject<boolean>(false);
  makingOrder$: Observable<boolean>;


  constructor(private _store: Store<AppState>, cartEvents: CartEvents, loadingIndicatorService: LoadingIndicatorService) {
    this.cartList$ = _store.pipe(select(({ cart }) => cart.items));
    this.totalPrice$ = _store.pipe(select(({ cart }) => cart.totalPrice));
    this.authUser$ = _store.pipe(select(({ auth }) => auth.authUser!), filter((authUser) => authUser != null))
    this.addressData$ = _store.pipe(
      select(({ auth }) => auth.authUser!),
      filter((user) => user != null),
      map(({ city, street, state, country }) => ({ city, street, state, country })),
    );
    this.userHaveItems$ = _store.pipe(
      select(({ cart }) => cart.items.length > 0),
      take(1),
      subscribeOn(asyncScheduler)
    );
    this.makingOrder$ = cartEvents.makingOrder$.pipe(
      tap((status) => {
        if (status === AsyncActionStatus.awaiting) {
          loadingIndicatorService.attach();
        } else {
          loadingIndicatorService.detach();
        }
      }),
      map((status) => status === AsyncActionStatus.resolved),
      startWith(false)
    );

  }

  onAccept(): void {
    this._store.dispatch(makeOrder());
  }
}
