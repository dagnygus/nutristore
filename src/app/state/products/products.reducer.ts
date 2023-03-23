import { Action, createReducer, on } from "@ngrx/store";
import { updateProducts } from "./products.actions";
import { productsInitialState, ProductsState } from "./products.state";

const _productsReducer = createReducer(
  productsInitialState,
  on(updateProducts, (_, { newState }) => newState)
);

export const productsReducer = (state: ProductsState | undefined, action: Action) => _productsReducer(state, action);
