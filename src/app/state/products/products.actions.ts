import { HttpErrorResponse } from "@angular/common/http";
import { Action, createAction, props } from "@ngrx/store";
import { ProductsState } from "./products.state";

export enum ProductsActionNames {
  getProducts = '[Products] get products by category',
  getGroupedProducst = '[Products] get grouped products',
  updateState = '[Products] update products state',
  error = '[Products] http error'
}

export const getProducts = createAction(ProductsActionNames.getProducts, props<{ category: string, info: string }>());
export const getGroupedProducts = createAction(ProductsActionNames.getGroupedProducst, props<{ info: string }>())
export const updateProducts = createAction(ProductsActionNames.updateState, props<{ newState: ProductsState, prevAction?: Action, info?: string }>());
export const productsHttpError = createAction(ProductsActionNames.error, props<{ error: HttpErrorResponse, prevAction?: Action, info?: string }>())
