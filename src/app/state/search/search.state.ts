import { Injectable } from "@angular/core";
import { select, Store } from "@ngrx/store";
import { AppState } from "../app.state";
import { BaseStateRef } from "../app.state.utils";

export interface SearchItemModel {
  readonly id: string;
  readonly name: string;
}

export interface SearchState {
  readonly key: string;
  readonly results: readonly SearchItemModel[];
}

export const searchInitialState: SearchState = { results: [], key: '' };

@Injectable({ providedIn: 'root' })
export class SearchStateRef extends BaseStateRef<SearchState> {
  constructor(store: Store<AppState>) {
    super(store.pipe(select(({ search }) => search)));
  }
}
