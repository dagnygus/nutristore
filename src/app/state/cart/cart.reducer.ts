import { Action, createReducer, on } from "@ngrx/store";
import { addCartItem, changeCartItemCount, clearCart, decreaseCartItemCount, increaseCartItemCount, orderPlaced, removeCartItem, restoreCartState } from "./cart.actions";
import { cartInitialState, CartItemModel, CartState } from "./cart.state";

const _cartReducer = createReducer(
  cartInitialState,
  on(addCartItem, (state, { item }) => {
    const items: CartItemModel[] = state.items.slice();
    const index = items.findIndex((it) => it.id === item.id);
    if (index > -1) {
      const updatedItem = _mergeItems(item, items[index]);
      items[index] = updatedItem;
    } else {
      items.push(item);
    }
    const totalPrice = _calculateTotalPrice(items);
    return { items, totalPrice }
  }),
  on(changeCartItemCount, (state, { index, newCount }) => {
    if (newCount < 1) {
      throw new Error('Cart item new count less then 1!')
    }
    const items: CartItemModel[] = state.items.slice();
    const item = items[index];
    const updatedItem: CartItemModel = { ...item, quantity: newCount }
    items[index] = updatedItem;
    const totalPrice = _calculateTotalPrice(items);
    return { items, totalPrice }
  }),
  on(increaseCartItemCount, (state, { index }) => {
    const items: CartItemModel[] = state.items.slice();
    const item = items[index];
    const newCount = item.quantity + 1
    const newTotalPrice = +(item.price.replace('$', '')) * newCount;
    const updatedItem: CartItemModel = { ...item, quantity: newCount, totalPrice: newTotalPrice + '$'};
    items[index] = updatedItem;
    const totalPrice = _calculateTotalPrice(items);
    return { items, totalPrice }
  }),
  on(decreaseCartItemCount, (state, { index }) => {
    const items: CartItemModel[] = state.items.slice();
    const item = items[index];

    if (item.quantity === 1) {
      throw new Error('Atempting to increase cart item count to less then 1!')
    }

    const newCount = item.quantity - 1
    const newTotalPrice = +(item.price.replace('$', '')) * newCount;
    const updatedItem: CartItemModel = { ...item, quantity: newCount, totalPrice: newTotalPrice + '$'};
    items[index] = updatedItem;
    const totalPrice = _calculateTotalPrice(items);
    return { items, totalPrice }
  }),
  on(removeCartItem, (state, { index }) => {
    const items: CartItemModel[] = state.items.slice();
    items.splice(index, 1);
    const totalPrice = _calculateTotalPrice(items);
    return { items, totalPrice }
  }),
  on(restoreCartState, (_, { state }) => state),
  on(clearCart, orderPlaced, (_1, _2) => cartInitialState)
)

export const cartReducer = (state: CartState | undefined, action: Action) => _cartReducer(state, action);

function _mergeItems(item1: CartItemModel, item2: CartItemModel): CartItemModel {
  const newCount = item1.quantity + item2.quantity;
  const price1 = +item1.totalPrice.replace('$', '');
  const price2 = +item2.totalPrice.replace('$', '');
  const newTotalPrice = price1 + price2;
  return { ...item1, quantity: newCount, totalPrice: newTotalPrice + '$' }
}


function _calculateTotalPrice(cart: readonly CartItemModel[]): string {
  let totalPrice = 0
  cart.forEach((item) => {
    totalPrice += (+item.totalPrice.replace('$', ''));
  });

  return totalPrice + '$';
}
