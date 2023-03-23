import { subscribeOn, takeUntil, distinctUntilChanged } from 'rxjs/operators';
import { AsyncActionStatus } from './../app.state.utils';
import mapper from "src/app/utils/url-category-mapper";

import { HttpClient } from "@angular/common/http";
import { Injectable, OnDestroy } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { asyncScheduler, catchError, filter, map, Observable, of, ReplaySubject, startWith, Subscription, switchMap, tap, zip } from "rxjs";
import { getGroupedProducts, getProducts, ProductsActionNames, productsHttpError, updateProducts } from "./products.actions";
import { GroupedProductsModel, ProductsItemModel, ProductsStateRef } from "./products.state";
import { AppState } from "../app.state";
import { Store } from "@ngrx/store";
import { StateStatus } from "../app.state.utils";
import { routerNavigationAction } from '@ngrx/router-store';

@Injectable()
export class ProductsEffects {
  getProductsByCategory$ = createEffect(() => this._actions$.pipe(
    ofType(getProducts),
    filter(({ category }) => this._productsStateRef.state.category !== category),
    switchMap((action) => this._httpClient.get<ProductsItemModel[]>(mapper.get(action.category)!).pipe(
      map((data) => updateProducts({ newState: { category: action.category, data }, prevAction: action })),
      catchError((error) => of(productsHttpError({ error, prevAction: action }))),
      takeUntil(this._actions$.pipe(ofType(routerNavigationAction), subscribeOn(asyncScheduler)))
    ))
  ));

  getGroupedProducts = createEffect(() => this._actions$.pipe(
    ofType(getGroupedProducts),
    filter(() => Array.isArray(this._productsStateRef.state.data)),
    switchMap((action) => {
      const source1$ = this._httpClient.get<ProductsItemModel[]>('assets/products-data/newest.json');
      const source2$ = this._httpClient.get<ProductsItemModel[]>('assets/products-data/most_popular.json');
      const source3$ = this._httpClient.get<ProductsItemModel[]>('assets/products-data/recomended.json');

      return zip(source1$, source2$, source3$).pipe(
        map(([newest, mostPopular, recomended]) => {
          const data: GroupedProductsModel = { newest, mostPopular, recomended };
          return updateProducts({ newState: { category: null, data }, prevAction: action })
        }),
        catchError((error) => of(productsHttpError({ error, prevAction: action }))),
        takeUntil(this._actions$.pipe(ofType(routerNavigationAction), subscribeOn(asyncScheduler)))
      );
    })
  ))

  constructor(private _actions$: Actions,
              private _httpClient: HttpClient,
              private _productsStateRef: ProductsStateRef) {}
}

@Injectable({ providedIn: 'root' })
export class ProductsEvents implements OnDestroy {

  private _subscription: Subscription;

  status$: Observable<StateStatus>;
  getingProducts$ = this._actions$.pipe(
    ofType(updateProducts, getGroupedProducts, getProducts, productsHttpError),
    filter((action) => {
      if (action.type === ProductsActionNames.updateState || action.type === ProductsActionNames.error) {
        if (action.prevAction) {
          return action.prevAction.type === ProductsActionNames.getProducts ||
                 action.prevAction.type === ProductsActionNames.getGroupedProducst;
        }
      }
      return true
    }),
    map((action) => {
      switch (action.type) {
        case ProductsActionNames.updateState:
          return AsyncActionStatus.resolved;
        case ProductsActionNames.error:
          return AsyncActionStatus.rejected;
        default:
          return AsyncActionStatus.awaiting;
      }
    })
  );

  constructor(private _actions$: Actions, productsStateRef: ProductsStateRef) {
    this.status$ = new ReplaySubject(1);
    this._subscription = this._actions$.pipe(
      ofType(updateProducts, getGroupedProducts, getProducts, productsHttpError),
      map((action) => {

        if (action.type === ProductsActionNames.updateState) {
          if (Array.isArray(productsStateRef.state.data) && productsStateRef.state.data.length === 0) {
            return StateStatus.empty;
          } else {
            return StateStatus.complete;
          }
        }

        if (action.type === ProductsActionNames.error) {
          return StateStatus.error;
        }

        if (action.type === ProductsActionNames.getGroupedProducst) {
          if (!Array.isArray(productsStateRef.state.data)) {
            return StateStatus.complete;
          }
        }

        if (action.type === ProductsActionNames.getProducts) {
          if (action.category === productsStateRef.state.category) {
            return StateStatus.complete;
          }
        }

        return StateStatus.pending;
      }),
      startWith(Array.isArray(productsStateRef.state.data) && productsStateRef.state.data.length === 0 ? StateStatus.empty : StateStatus.complete),
      distinctUntilChanged()
    ).subscribe(this.status$ as any);
  }

  ngOnDestroy(): void {
    this._subscription.unsubscribe();
  }
}
