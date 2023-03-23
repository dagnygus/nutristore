import { AppState } from 'src/app/state/app.state';
import { Injectable } from "@angular/core";
import { select, Store } from "@ngrx/store";
import { BaseStateRef } from "../app.state.utils";

export interface RegisterModel {
  firstName: string;
  lastName: string;
  email: string;
  city: string;
  street: string;
  state: string;
  country: string;
  password: string;
  confirmPassword: string;
  zipCode: string
}

export interface AuthStorageModel extends RegisterModel {
  readonly id: number
}

export interface LoginModel {
  email: string,
  password: string,
}

export interface NewPasswordModel {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface UpdateUserModel {
  firstName: string;
  lastName: string;
  email: string;
  city: string;
  street: string;
  state: string;
  country: string;
  zipCode: string
}

export interface AuthUserModel {
  readonly id: number;
  readonly firstName: string;
  readonly lastName: string;
  readonly email: string;
  readonly city: string;
  readonly street: string;
  readonly state: string;
  readonly country: string;
  readonly zipCode: string;
}

export interface AuthState {
  readonly authUser: AuthUserModel | null;
}

export const authInitialState: AuthState = {
  authUser: null,
}

@Injectable({ providedIn: 'root' })
export class AuthStateRef extends BaseStateRef<AuthState> {
  constructor(store: Store<AppState>) {
    super(store.pipe(select(({ auth }) => auth)));
  }
}
