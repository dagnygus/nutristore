import { HttpErrorResponse } from '@angular/common/http';
import { Action, createAction, props } from '@ngrx/store';
import { ProductState } from './product.state';
export enum ProductActionsNames {
  getPorduct = '[Single Product] get product',
  updateState = '[Single Product] update product state',
  error = '[Single Product] product http error',
}

export const getProduct = createAction(ProductActionsNames.getPorduct, props<{ id: string, info: string }>());
export const updateProductState = createAction(ProductActionsNames.updateState, props<{ newState: ProductState, prevAction?: Action, info?: string }>());
export const productHttpError = createAction(ProductActionsNames.error, props<{ error: HttpErrorResponse, prevAction: Action, info?: string }>())
