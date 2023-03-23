import { ProductEvents } from './../../state/product/product.effects';
import { CartItemModel } from './../../state/cart/cart.state';
import { AddToCartService } from './../../modules/core/services/add-to-cart-dialog.service';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { BehaviorSubject, filter, Observable, of, tap } from 'rxjs';
import { DetachView } from 'src/app/modules/shared/directives/detach-view.directive';
import { SharedModule } from 'src/app/modules/shared/shared.module';
import { AppState } from 'src/app/state/app.state';
import { ProductModel } from 'src/app/state/product/product.state';
import { PriceToNumberPipe } from './pipes/price-to-number.pipe';
import { addCartItem } from 'src/app/state/cart/cart.actions';
import { StateStatus } from 'src/app/state/app.state.utils';

@Component({
  selector: 'app-single-product',
  templateUrl: './single-product.component.html',
  styleUrls: ['./single-product.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  hostDirectives: [ DetachView ],
  imports: [ SharedModule, PriceToNumberPipe ],
  host: { 'class': 'text-white text-[12px] bg-transparent-blue-grey backdrop-blur-sm page min-h-[90vh]' }
})
export class SingleProductComponent {
  readonly StateStatus = StateStatus;

  product$: Observable<ProductModel>;
  quantity$ = new BehaviorSubject(1);
  productStateus$: Observable<StateStatus>;

  constructor(private _store: Store<AppState>,
              private _addToCartService: AddToCartService,
              productEvents: ProductEvents) {
    this.product$ = _store.pipe(
      select(({ product }) => product.productData!),
      filter((data) => data !== null)
    )
    this.productStateus$ = productEvents.status$;
  }

  incease(): void {
    this.quantity$.next(this.quantity$.value + 1);
  }

  decrease(): void {
    if (this.quantity$.value === 1) { return; }
    this.quantity$.next(this.quantity$.value - 1);
  }

  onAddToCartBtnClick({ id, name, imageUrl, price }: ProductModel, quantity: number): void {
    const totalPrice = quantity * (+price.substring(0, price.length - 1)) + '$';
    const cartItem: CartItemModel = { id, name, imageUrl, price, totalPrice, quantity };
    this._store.dispatch(addCartItem({ item: cartItem }));
    this._addToCartService.open(name);
  }
}
