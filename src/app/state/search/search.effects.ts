import { HttpClient } from '@angular/common/http';
import { filter, map, of, switchMap, tap } from 'rxjs';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { searchProducts, updateSearchState } from './search.actions';
import { searchInitialState, SearchItemModel, SearchState, SearchStateRef } from './search.state';

const URL = 'assets/products-data/individual-products/prod_list.json';

@Injectable()
export class SearchEffects {
  search$ = createEffect(() => this._actions$.pipe(
    ofType(searchProducts),
    filter(({ searchKey }) => searchKey.toLowerCase() !== this._searchStateRef.state.key.toLowerCase()),
    switchMap((action) => {
      if (action.searchKey === '') {
        return of(updateSearchState({ newState: searchInitialState }))
      } else {
        return this._httpClient.get<SearchItemModel[]>(URL).pipe(map((results) => {
          results.sort((prev, curr) => {
            if (prev.name < curr.name) { return -1; }
            if (prev.name > curr.name) { return +1; }
            return 0;
          });

          results = results.filter((result) => result.name.toLowerCase().includes(action.searchKey.toLowerCase()));

          if (results.length > 10) {
            results.splice(10);
          }

          const newState: SearchState = {
            key: action.searchKey,
            results
          };

          return updateSearchState({ newState });
        }))
      }
    })
  ));

  constructor(private _actions$: Actions, private _httpClient: HttpClient, private _searchStateRef: SearchStateRef) {}
}
