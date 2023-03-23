import { AppState } from 'src/app/state/app.state';
import { Injectable } from "@angular/core";
import { BaseStateRef } from "../app.state.utils";
import { Store, select } from '@ngrx/store';

export interface CartItemModel {
  readonly id: string;
  readonly name: string;
  readonly imageUrl: string;
  readonly price: string;
  readonly totalPrice: string
  readonly quantity: number;
}

export interface CartState {
  readonly items: readonly CartItemModel[];
  readonly totalPrice: string;
}

export const cartInitialState: CartState = {
  items: [],
  totalPrice: '0$'
}

@Injectable({ providedIn: 'root' })
export class CartStateRef extends BaseStateRef<CartState> {
  constructor(store: Store<AppState>) {
    super(store.pipe(select(({ cart }) => cart)));
  }
}
