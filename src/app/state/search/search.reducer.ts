import { searchInitialState, SearchState } from './search.state';
import { updateSearchState } from './search.actions';
import { Action, createReducer, on } from '@ngrx/store';

const _searchReducer = createReducer(
  searchInitialState,
  on(updateSearchState, (_, { newState }) => newState)
)

export const searchReducer = (state: SearchState | undefined, action: Action) => _searchReducer(state, action);
