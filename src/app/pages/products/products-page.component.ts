import { ProductsEvents } from './../../state/products/products.effects';
import { AddToCartService } from './../../modules/core/services/add-to-cart-dialog.service';
import { AppState } from 'src/app/state/app.state';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SharedModule } from 'src/app/modules/shared/shared.module';
import { DetachView } from 'src/app/modules/shared/directives/detach-view.directive';
import { filter, Observable, of } from 'rxjs';
import { ProductsItemModel } from 'src/app/state/products/products.state';
import { select, Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { addCartItem } from 'src/app/state/cart/cart.actions';
import { StateStatus } from 'src/app/state/app.state.utils';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [SharedModule],
  hostDirectives: [DetachView],
  templateUrl: './products-page.component.html',
  styleUrls: ['./products-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { 'class': 'block page min-h-[90vh]' }
})
export class ProductsPageComponent {
  readonly products$: Observable<readonly ProductsItemModel[]>;
  readonly productsStatus$: Observable<StateStatus>;

  constructor(private _store: Store<AppState>,
              private _router: Router,
              private _addToCartService: AddToCartService,
              productsEvents: ProductsEvents) {
    this.products$ = _store.pipe(
      select(({ products }) => products.data as ReadonlyArray<ProductsItemModel>),
      filter((data) => Array.isArray(data))
    );
    this.productsStatus$ = productsEvents.status$;
    // this.productsStatus$ = of(StateStatus.pending)
  }

  onProductSelected(id: string): void {
    this._router.navigate(['', 'product', id]);
  }

  onAddProduct({ id, name, price, imageUrl }: ProductsItemModel): void {
    this._store.dispatch(addCartItem({ item: { id, name, price, totalPrice: price, imageUrl, quantity: 1 } }));
    this._addToCartService.open(name);
  }
}
