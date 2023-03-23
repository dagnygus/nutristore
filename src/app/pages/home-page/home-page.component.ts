import { AsyncActionStatus, StateStatus } from 'src/app/state/app.state.utils';
import { ProductsEffects, ProductsEvents } from './../../state/products/products.effects';
import { GroupedProductsModel, ProductsItemModel } from './../../state/products/products.state';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SharedModule } from 'src/app/modules/shared/shared.module';
import { DetachView } from 'src/app/modules/shared/directives/detach-view.directive';
import { select, Store } from '@ngrx/store';
import { AppState } from 'src/app/state/app.state';
import { filter, map, Observable, of, shareReplay, subscribeOn, asyncScheduler, delay, tap } from 'rxjs';
import { Router } from '@angular/router';
import { AddToCartService } from 'src/app/modules/core/services/add-to-cart-dialog.service';
import { addCartItem } from 'src/app/state/cart/cart.actions';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [SharedModule],
  hostDirectives: [DetachView],
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { 'class': 'block page min-h-[90vh]' }
})
export class HomePageComponent {

  readonly StateStatus = StateStatus

  readonly newestProducts$: Observable<readonly ProductsItemModel[]>;
  readonly popularProducts$: Observable<readonly ProductsItemModel[]>;
  readonly recomendedProducts$: Observable<readonly ProductsItemModel[]>;
  readonly productsStatus$: Observable<StateStatus>;
  readonly fakeProducts$: Observable<readonly ProductsItemModel[]> = of([])

  constructor(private _store: Store<AppState>,
              private _router: Router,
              private _addToCartService: AddToCartService,
              productsEvents: ProductsEvents) {
    const source =  _store.pipe(
      select(({ products }) => products.data as GroupedProductsModel),
      filter((data) => !Array.isArray(data)),
      shareReplay({ bufferSize: 1, refCount: true })
    );

    this.newestProducts$ = source.pipe(map(({ newest }) => newest));
    this.popularProducts$ = source.pipe(map(({ mostPopular }) => mostPopular));
    this.recomendedProducts$ = source.pipe(map(({ recomended }) => recomended));
    this.productsStatus$ = productsEvents.status$;
  }

  onProductSelected(id: string) {
    this._router.navigate(['/', 'product', id]);
  }

  onAddProduct({ id, name, imageUrl, price }: ProductsItemModel): void {
    this._store.dispatch(addCartItem({ item: { id, name, price, totalPrice: price, imageUrl, quantity: 1 } }));
    this._addToCartService.open(name);
  }

}
