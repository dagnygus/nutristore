import { ProductEffect } from './product/product.effects';
import { RouterEffects } from './router/router.effects';
import { routerReducer, RouterReducerState } from "@ngrx/router-store";
import { ProductsEffects } from "./products/products.effects";
import { productsReducer } from "./products/products.reducer";
import { ProductsState } from "./products/products.state";
import { RouterStateUrl } from "./router/router-serializer";
import { AuthState } from './auth/auth.state';
import { authReducer } from './auth/auth.reducer';
import { AuthEffects } from './auth/auth.effects';
import { ProductState } from './product/product.state';
import { productReducer } from './product/product.reducer';
import { CartState } from './cart/cart.state';
import { cartReducer } from './cart/cart.reducer';
import { CartEffects } from './cart/cart.effects';
import { SearchState } from './search/search.state';
import { searchReducer } from './search/search.reducer';
import { SearchEffects } from './search/search.effects';

export interface AppState {
  readonly products: ProductsState;
  readonly product: ProductState;
  readonly auth: AuthState;
  readonly cart: CartState;
  readonly search: SearchState;
  readonly router?: RouterReducerState<RouterStateUrl>;
}

export const appReducers = {
  router: routerReducer,
  auth: authReducer,
  products: productsReducer,
  product: productReducer,
  cart: cartReducer,
  search: searchReducer
}

export const appEffects = [
  ProductsEffects,
  ProductEffect,
  CartEffects,
  AuthEffects,
  RouterEffects,
  SearchEffects
]
