import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { AppState } from '../app.state';
import { BaseStateRef } from "../app.state.utils";

export interface ProductModel {
  readonly id: string;
  readonly name: string;
  readonly rating: number;
  readonly price: string;
  readonly imageUrl: string;
  readonly description: string;
  readonly ingredients: readonly string[];
}

export interface ProductState {
  readonly productData: ProductModel | null;
}

export const productInitialState: ProductState = { productData: null }

@Injectable({ providedIn: 'root' })
export class ProductStateRef extends BaseStateRef<ProductState> {
  constructor(store: Store<AppState>) {
    super(store.pipe(select(({ product }) => product)));
  }
}
