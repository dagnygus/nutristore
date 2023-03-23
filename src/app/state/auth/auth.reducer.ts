import { updateAuthState } from './auth.actions';
import { Action, createReducer, on } from "@ngrx/store";
import { authInitialState, AuthState } from "./auth.state";

const _authReducer = createReducer(
  authInitialState,
  on(updateAuthState, (_, { newState }) => newState)
)

export const authReducer = (state: AuthState | undefined, action: Action) => _authReducer(state, action);
