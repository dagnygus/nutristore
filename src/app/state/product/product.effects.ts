import { HttpClient } from "@angular/common/http";
import { Injectable, OnDestroy } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { routerNavigationAction } from "@ngrx/router-store";
import { asyncScheduler, catchError, map, Observable, of, ReplaySubject, startWith, subscribeOn, Subscription, switchMap, takeUntil } from "rxjs";
import { StateStatus } from "../app.state.utils";
import { getProduct, ProductActionsNames, productHttpError, updateProductState } from "./product.actions";
import { ProductModel, ProductStateRef } from "./product.state";

const BASE_URL = 'assets/products-data/individual-products/';

@Injectable()
export class ProductEffect {
  getProduct$ = createEffect(() => this._actions$.pipe(
    ofType(getProduct),
    switchMap((action) => this._httpClient.get<ProductModel>(BASE_URL + action.id + '.json').pipe(
      map((productData) => updateProductState({ newState: { productData }, prevAction: action })),
      catchError((error) => of(productHttpError({ error, prevAction: action }))),
      takeUntil(this._actions$.pipe(ofType(routerNavigationAction), subscribeOn(asyncScheduler)))
    ))
  ));

  constructor(private _actions$: Actions,
              private _httpClient: HttpClient) {}
}

@Injectable({ providedIn: 'root' })
export class ProductEvents implements OnDestroy {

  private _subscription: Subscription

  status$: Observable<StateStatus>;

  constructor(private _actions$: Actions, productStateRef: ProductStateRef) {
    this.status$ = new ReplaySubject(1);
    this._subscription = this._actions$.pipe(
      ofType(getProduct, updateProductState, productHttpError),
      map((action) => {
        switch (action.type) {
          case ProductActionsNames.updateState:
            if (productStateRef.state.productData) {
              return StateStatus.complete;
            } else {
              return StateStatus.empty;
            }
          case ProductActionsNames.error:
            return StateStatus.error;
          default:
            return StateStatus.pending;
        }
      }),
      startWith(productStateRef.state ? StateStatus.complete : StateStatus.error)
    ).subscribe(this.status$ as any);
  }

  ngOnDestroy(): void {
    this._subscription.unsubscribe();
  }
}
