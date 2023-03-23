import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { AppState } from '../app.state';
import { BaseStateRef } from "../app.state.utils";

export interface ProductsItemModel {
  readonly id: string;
  readonly name: string;
  readonly rating: number;
  readonly price: string;
  readonly imageUrl: string;
}

export interface GroupedProductsModel {
  readonly newest: readonly ProductsItemModel[],
  readonly mostPopular: readonly ProductsItemModel[],
  readonly recomended: readonly ProductsItemModel[],
}

export interface ProductsState {
  readonly data: readonly ProductsItemModel[] | GroupedProductsModel;
  readonly category: string | null;
}

export const productsInitialState: ProductsState = {
  data: [],
  category: null,
}

@Injectable({ providedIn: 'root' })
export class ProductsStateRef extends BaseStateRef<ProductsState> {
  constructor(store: Store<AppState>) {
    super(store.pipe(select(({ products }) => products)));
  }
}
