import { Action, createAction, props } from '@ngrx/store';
import { AuthState, LoginModel, NewPasswordModel, RegisterModel, UpdateUserModel } from './auth.state';
export enum AuthActionsNames {
  signup = '[Auth] signup',
  signin = '[Auth] signin',
  logout = '[AUTH] logout',
  updateUserData = '[Auth] update user data',
  updateAuthState = '[Auth] update auth state',
  newPassword = '[Auth] change password',
  newPasswordSuccess = '[Auth] change password success',
  error = '[Auth] error'
}

export const signin = createAction(AuthActionsNames.signin, props<{ data: LoginModel, info: string }>());
export const signup = createAction(AuthActionsNames.signup, props<{ data: RegisterModel, info: string }>());
export const updateUserData = createAction(AuthActionsNames.updateUserData, props<{ data: UpdateUserModel, info: string }>());
export const updateAuthState = createAction(AuthActionsNames.updateAuthState, props<{ newState: AuthState, prevActon?: Action, info?: string}>());
export const authError = createAction(AuthActionsNames.error, props<{ prevAction: Action, info?: string, error: { message: string } }>())
export const logout = createAction(AuthActionsNames.logout);
export const newPassword = createAction(AuthActionsNames.newPassword, props<{ data: NewPasswordModel, info: string }>())
export const newPasswordSuccess = createAction(AuthActionsNames.newPasswordSuccess)
