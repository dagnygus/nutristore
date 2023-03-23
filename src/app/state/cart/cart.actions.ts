import { CartItemModel, CartState } from './cart.state';
import { createAction, props } from "@ngrx/store";

export enum CartActionsNames {
  addItem = '[Cart] add cart item',
  changeQuantity = '[Cart] change quantity',
  increaseCount = '[Cart] increase count',
  decreaseCount = '[Cart] deacrese count',
  removeItem = '[Cart] remove cart item',
  clearCart = '[Cart] clear cart',
  restore = '[Cart] restore cart from local storage',
  makeOrder = '[Cart] send request for order',
  orderPlaced = '[Cart] order placed'
}

export const addCartItem = createAction(CartActionsNames.addItem, props<{ item: CartItemModel }>());
export const changeCartItemCount = createAction(CartActionsNames.changeQuantity, props<{ index: number, newCount: number }>());
export const increaseCartItemCount = createAction(CartActionsNames.increaseCount, props<{ index: number }>());
export const decreaseCartItemCount = createAction(CartActionsNames.decreaseCount, props<{ index: number }>());
export const removeCartItem = createAction(CartActionsNames.removeItem, props<{ index: number }>());
export const clearCart = createAction(CartActionsNames.clearCart);
export const restoreCartState = createAction(CartActionsNames.restore, props<{ state: CartState }>());
export const makeOrder = createAction(CartActionsNames.makeOrder);
export const orderPlaced = createAction(CartActionsNames.orderPlaced);
