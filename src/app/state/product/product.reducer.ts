import { updateProductState } from './product.actions';
import { Action, createReducer, on } from "@ngrx/store";
import { productInitialState, ProductState } from "./product.state";

const _productReducer = createReducer(
  productInitialState,
  on(updateProductState, (_, { newState }) => newState)
)
export const productReducer = (state: ProductState | undefined, action: Action) => _productReducer(state, action)
