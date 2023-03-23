import { RouterStateRef } from './router-serializer';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Injectable } from "@angular/core";
import { routerNavigatedAction } from '@ngrx/router-store';
import { filter, map, skip, tap } from 'rxjs';
import { getGroupedProducts, getProducts } from '../products/products.actions';
import { assertNotNull } from 'src/app/utils/assertions';
import { WindowScroller } from 'src/app/modules/core/services/window-scroller';
import { getProduct } from '../product/product.actions';
import { BreakpointObserver } from '@angular/cdk/layout';

@Injectable()
export class RouterEffects {

  getGroupedProducts$ = createEffect(() => this._actions$.pipe(
    ofType(routerNavigatedAction),
    filter(() => this._routerStateRef.state.fullPath === ''),
    map(() => getGroupedProducts({ info: 'geting products for home page'}))
  ));

  getProducts$ = createEffect(() => this._actions$.pipe(
    ofType(routerNavigatedAction),
    filter(() => this._routerStateRef.state.fullPath === 'products'),
    map(() => {
      assertNotNull(this._routerStateRef.state.fragment);
      return getProducts({ category: this._routerStateRef.state.fragment, info: 'Geting products for producst page.' })
    })
  ));

  getProduct$ = createEffect(() => this._actions$.pipe(
    ofType(routerNavigatedAction),
    filter(() => this._routerStateRef.state.fullPath === 'product/:productId'),
    map(() => getProduct({ id: this._routerStateRef.state.params['productId'], info: 'Geting single product for single product page.' }))
  ));

  scrollOnNavigated$ = createEffect(() => this._actions$.pipe(
    ofType(routerNavigatedAction),
    skip(1),
    tap(() => {
      const path = this._routerStateRef.state.fullPath;

      switch (path) {
        case '':
          this._scroller.scroll('header');
          break;
          case 'products':
            if (this._breakpointObserver.isMatched('(min-width: 640px)')) {
              this._scroller.scroll('#searchbox', { addOffset: -18 });
            } else {
              this._scroller.scroll('#subtitle', { side: 'bottom' });
            }
          break;
          default:
            this._scroller.scroll('header', { side: 'bottom' });
          break;
      }

    })
  ), { dispatch: false });

  constructor(private _actions$: Actions,
              private _routerStateRef: RouterStateRef,
              private _scroller: WindowScroller,
              private _breakpointObserver: BreakpointObserver) {}
}
