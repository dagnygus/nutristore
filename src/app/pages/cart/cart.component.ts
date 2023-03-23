import { trigger, transition, animate, style } from '@angular/animations';
import { distinctUntilChanged, observeOn } from 'rxjs/operators';
import { CartListComponent } from './components/cart-list/cart-list.component';
import { SharedModule } from './../../modules/shared/shared.module';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DetachView } from 'src/app/modules/shared/directives/detach-view.directive';
import { select, Store } from '@ngrx/store';
import { AppState } from 'src/app/state/app.state';
import { asyncScheduler, Observable, tap, subscribeOn } from 'rxjs';
import { CartItemModel } from 'src/app/state/cart/cart.state';
import { clearCart, decreaseCartItemCount, increaseCartItemCount, removeCartItem } from 'src/app/state/cart/cart.actions';
import { commonApearanceAnimation } from 'src/app/utils/common-ng-aniamtions';

const cartContentAnimationMetadata = trigger('cartContent', commonApearanceAnimation)

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [SharedModule, CartListComponent],
  hostDirectives: [DetachView],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'page min-h-[90vh] grid' },
  animations: [ cartContentAnimationMetadata ]
})
export class CartComponent {

  cartList$: Observable<readonly CartItemModel[]>;
  totalPrice$: Observable<string>;
  cartHasItems$: Observable<boolean>;

  constructor(private _store: Store<AppState>) {
    this.cartList$ = _store.pipe(select(({ cart }) => cart.items));
    this.totalPrice$ = _store.pipe(select(({cart}) => cart.totalPrice));
    this.cartHasItems$ = _store.pipe(select(
      ({ cart }) => cart.items.length > 0),
      distinctUntilChanged(),
      observeOn(asyncScheduler)
    );
  }

  onIncrease(index: number): void {
    this._store.dispatch(increaseCartItemCount({ index }));
  }

  onDecrease(index: number): void {
    this._store.dispatch(decreaseCartItemCount({ index }));
  }

  onRemove(index: number): void {
    this._store.dispatch(removeCartItem({ index }));
  }

  onClearButtonClick(): void {
    this._store.dispatch(clearCart());
  }
}
