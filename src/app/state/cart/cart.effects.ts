import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { asyncScheduler, delay, filter, map, of, subscribeOn, switchMap, tap } from "rxjs";
import { LocalStorageService } from "src/app/modules/core/services/localstorage.service";
import { AsyncActionStatus } from "../app.state.utils";
import { addCartItem, CartActionsNames, changeCartItemCount, clearCart, decreaseCartItemCount, increaseCartItemCount, makeOrder, orderPlaced, removeCartItem, restoreCartState } from "./cart.actions";
import { CartState, CartStateRef } from "./cart.state";

@Injectable()
export class CartEffects {
  saveInLocalStorage$ = createEffect(() => this._actions$.pipe(
    ofType(addCartItem, changeCartItemCount, increaseCartItemCount, decreaseCartItemCount, removeCartItem, clearCart, orderPlaced),
    tap(() => {
      if (this._cartStateRef.state.items.length > 0) {
        this._localStorage.setItem('CART_STATE', this._cartStateRef.state);
      } else {
        this._localStorage.removeItem('CART_STATE');
      }
    })
  ), { dispatch: false });

  getStateFromLocalStorage$ = createEffect(() => of(this._localStorage.getItem<CartState>('CART_STATE')!).pipe(
    filter((state) => state !== null),
    map((state) => restoreCartState({ state })),
    subscribeOn(asyncScheduler)
  ));

  makeOrder$ = createEffect(() => this._actions$.pipe(
    ofType(makeOrder),
    switchMap(() => {
      const time = 5 * Math.random() * 1000;
      return of(orderPlaced()).pipe(delay(time))
    })
  ))

  constructor(private _actions$: Actions,
              private _localStorage: LocalStorageService,
              private _cartStateRef: CartStateRef) {}
}

@Injectable({ providedIn: 'root' })
export class CartEvents {

  makingOrder$ = this._actions$.pipe(
    ofType(makeOrder, orderPlaced),
    map((action) => {
      switch (action.type) {
        case CartActionsNames.makeOrder:
          return AsyncActionStatus.awaiting;
        default:
          return AsyncActionStatus.resolved;
      }
    })
  )

  constructor(private _actions$: Actions) { }
}
