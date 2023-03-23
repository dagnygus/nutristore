import { createAction, props } from "@ngrx/store";
import { SearchState } from "./search.state";

export enum SearchActionNames {
  search = '[Search] search for products',
  updateSearchState = '[Search] update search state',
}

export const searchProducts = createAction(SearchActionNames.search, props<{ searchKey: string }>());
export const updateSearchState = createAction(SearchActionNames.updateSearchState, props<{ newState: SearchState }>());
