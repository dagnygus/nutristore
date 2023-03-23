import { RouterStateRef } from './../router/router-serializer';
import { AsyncActionStatus } from './../app.state.utils';
import { filter, map, observeOn, share, asyncScheduler } from 'rxjs';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, delay, exhaustMap, of, tap, throwError } from 'rxjs';
import { LocalStorageService } from 'src/app/modules/core/services/localstorage.service';
import { AuthActionsNames, authError, logout, newPassword, newPasswordSuccess, signin, signup, updateAuthState, updateUserData } from './auth.actions';
import { authInitialState, AuthState, AuthStateRef, AuthStorageModel, AuthUserModel, RegisterModel } from './auth.state';
import { assertNotNull } from 'src/app/utils/assertions';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { AppState } from '../app.state';
import { Location } from '@angular/common';

const AUTH_PATHS = [
  '/forms/update',
  '/forms/password',
  '/account',
  '/checkout'
]

@Injectable()
export class AuthEffects {
  signin$ = createEffect(() => this._actions$.pipe(
    ofType(signin),
    filter(() => this._authStateRef.state.authUser === null),
    exhaustMap((action) => {
      const time = _randomDelay();
      const registrationData = this._getRegistrationData();
      if (registrationData === null) {
        return throwError(() => { message: 'not_found' }).pipe(
          delay(time),
          catchError((error) => of(authError({ prevAction: action, error })))
        );
      }

      const index = registrationData.findIndex((data) => data.email === action.data.email);

      if (index < 0) {
        return throwError(() => { message: 'not_found' }).pipe(
          delay(time),
          catchError((error) => of(authError({ prevAction: action, error })))
        );
      }

      const storageModel = registrationData[index];

      if (storageModel.password !== action.data.password) {
        return throwError(() => { message: 'unauthorized' }).pipe(
          delay(time),
          catchError((error) => of(authError({ prevAction: action, error })))
        );
      }

      const { id, firstName, lastName, email, city, street, state, country, zipCode } = storageModel;
      const authUser: AuthUserModel = { id, firstName, lastName, email, city, street, state, country, zipCode };
      const newState: AuthState = { authUser }

      return of(updateAuthState({ newState, prevActon: action })).pipe(
        delay(time),
        tap(() => this._setIsAuth({ id, email }))
      );
    })
  ));

  signup$ = createEffect(() => this._actions$.pipe(
    ofType(signup),
    exhaustMap((action) => {
      const time = _randomDelay();

      const registrationData = this._localStorage.getItem<RegisterModel[]>('REG_DATA');
      if (registrationData) {
        const index = registrationData.findIndex((data) => data.email === action.data.email);
        if (index > -1) {
          return throwError(() => { message: 'conflict' }).pipe(
            delay(time),
            catchError((error) => of(authError({ prevAction: action, error })))
          );
        }
      }

      const id = registrationData?.length ?? 0;

      const { firstName, lastName, email, city, street, state, country, zipCode } = action.data
      const authUser: AuthUserModel = { id, firstName, lastName, email, city, street, state, country, zipCode };
      const newState: AuthState = { authUser };

      return of(updateAuthState({ newState, prevActon: action })).pipe(
        delay(time),
        tap(() => {
          const registrationData = this._getRegistrationData() ?? [];
          const storageModel: AuthStorageModel = { id, ...action.data }
          registrationData.push(storageModel);

          this._setRegistrationData(registrationData);
          this._setIsAuth({ id, email });
        })
      )
    })
  ));

  updateUser$ = createEffect(() => this._actions$.pipe(
    ofType(updateUserData),
    filter(() => this._authStateRef.state.authUser !== null),
    exhaustMap((action) => {
      const time = _randomDelay();
      const registrationData = this._getRegistrationData();
      assertNotNull(registrationData);
      const id = this._authStateRef.state.authUser!.id;
      const index = registrationData.findIndex((data) => data.email === action.data.email && data.id !== id);

      if (index > -1) {
        const index = registrationData.findIndex((data) => data.email === action.data.email);
        if (index > -1) {
          return throwError(() => { message: 'conflict' }).pipe(
            delay(time),
            catchError((error) => of(authError({ prevAction: action, error })))
            );
          }
        }
      const { firstName, lastName, email, city, street, state, country, zipCode } = action.data;
      const authUser: AuthUserModel = { id, firstName, lastName, email, city, street, state, country, zipCode };
      const newState: AuthState = { authUser }

      return of(updateAuthState({ newState, prevActon: action })).pipe(
        delay(time),
        tap(() => {
          const storageModel = registrationData[id];
          const newStorageModel: AuthStorageModel = {
            ...storageModel,
            firstName,
            lastName,
            email,
            city,
            street,
            state,
            country
          };

          registrationData[id] = newStorageModel;
          this._setRegistrationData(registrationData);
        })
      )
    })
  ))

  logout$ = createEffect(() => this._actions$.pipe(
    ofType(logout),
    tap(() => this._setIsAuth(null)),
    map((action) => updateAuthState({ newState: authInitialState, prevActon: action}))
  ));

  autologin$ = createEffect(() => of(this._getIsAuth()!).pipe(
    filter((isAuthData) => isAuthData !== null),
    map((isAuthData) => ({ isAuthData, registrationData: this._getRegistrationData()! })),
    filter(({ registrationData }) => registrationData !== null),
    map(({ isAuthData, registrationData }) => {
      assertNotNull(registrationData);
      const storageModel = registrationData[isAuthData.id];
      const { id, firstName, lastName, email, city, street, state, country, zipCode } = storageModel;
      const authUser: AuthUserModel = { id, firstName, lastName, email, city, street, state, country, zipCode };
      const newState: AuthState = { authUser };
      return updateAuthState({ newState, info: 'autologin' });
    })
  ));

  changePassword$ = createEffect(() => this._actions$.pipe(
    ofType(newPassword),
    exhaustMap((action) => {
      const time = _randomDelay();
      const registrationData = this._getRegistrationData();
      const authUser = this._authStateRef.state.authUser;
      assertNotNull(registrationData);
      assertNotNull(authUser);
      const { oldPassword, newPassword, confirmPassword } = action.data

      const storageData = registrationData[authUser.id];

      if (storageData.password === newPassword || newPassword !== confirmPassword) {
        return throwError(() => { message: 'bad_request' }).pipe(
          delay(time),
          catchError((error) => of(authError({ prevAction: action, error })))
        );

      }

      storageData.password = action.data.newPassword;

      return of(newPasswordSuccess()).pipe(
        delay(time),
        tap(() => {
          this._setRegistrationData(registrationData);
        })
      );
    })
  ))

  redirect$ = createEffect(() => this._store.pipe(
    select(({ auth }) => auth),
    observeOn(asyncScheduler),
    tap(({ authUser }) => {
      if (!authUser) {
        const currentUrl = this._routerStateRef.state.url;
        if (AUTH_PATHS.includes(currentUrl)) {
          this._router.navigateByUrl('/forms/login', { state: { targetUrl: currentUrl } })
        }
      }
    })
  ), { dispatch: false });

  constructor(private _actions$: Actions,
              private _localStorage: LocalStorageService,
              private _authStateRef: AuthStateRef,
              private _routerStateRef: RouterStateRef,
              private _router: Router,
              private _store: Store<AppState>) { }


  private _getRegistrationData(): AuthStorageModel[] | null {
    return this._localStorage.getItem<AuthStorageModel[]>('REG_DATA');
  }
  private _setRegistrationData(data: AuthStorageModel[]): void {

    this._localStorage.setItem('REG_DATA', data);
  }
  private _getIsAuth(): { id: number, email: string } | null {
    return this._localStorage.getItem<{ id: number, email: string }>('IS_AUTH');
  }
  private _setIsAuth(data: { id: number, email: string } | null): void {
    if (data) {
      this._localStorage.setItem('IS_AUTH', data);
    } else {
      this._localStorage.removeItem('IS_AUTH');
    }
  }
}


function _randomDelay(): number {
  return 4 * Math.random() * 1000
}

@Injectable({ providedIn: 'root' })
export class AuthEvents {

  signingIn$ = this._actions$.pipe(
    ofType(signin, authError, updateAuthState),
    filter((action) => {
      if (action.type === AuthActionsNames.updateAuthState) {
        return action.prevActon?.type === AuthActionsNames.signin;
      }
      if (action.type === AuthActionsNames.error) {
        return action.prevAction.type === AuthActionsNames.signin;
      }
      return true;
    }),
    map((action) => {
      switch (action.type) {
        case AuthActionsNames.updateAuthState:
          return AsyncActionStatus.resolved;
        case AuthActionsNames.error:
          return AsyncActionStatus.rejected;
        default:
          return AsyncActionStatus.awaiting;
      }
    }),
    share()
  );

  signingUp$ = this._actions$.pipe(
    ofType(signup, authError, updateAuthState),
    filter((action) => {
      if (action.type === AuthActionsNames.updateAuthState) {
        return action.prevActon?.type === AuthActionsNames.signup;
      }
      if (action.type === AuthActionsNames.error) {
        return action.prevAction.type === AuthActionsNames.signup;
      }
      return true;
    }),
    map((action) => {
      switch (action.type) {
        case AuthActionsNames.updateAuthState:
          return AsyncActionStatus.resolved;
        case AuthActionsNames.error:
          return AsyncActionStatus.rejected;
        default:
          return AsyncActionStatus.awaiting;
      }
    }),
    share()
  );

  updating$ = this._actions$.pipe(
    ofType(updateUserData, authError, updateAuthState),
    filter((action) => {
      if (action.type === AuthActionsNames.updateAuthState) {
        return action.prevActon?.type === AuthActionsNames.updateUserData;
      }
      if (action.type === AuthActionsNames.error) {
        return action.prevAction.type === AuthActionsNames.updateUserData;
      }
      return true;
    }),
    map((action) => {
      switch (action.type) {
        case AuthActionsNames.updateAuthState:
          return AsyncActionStatus.resolved;
        case AuthActionsNames.error:
          return AsyncActionStatus.rejected;
        default:
          return AsyncActionStatus.awaiting;
      }
    }),
    share()
  );

  changingPassword$ = this._actions$.pipe(
    ofType(newPassword, newPasswordSuccess, authError),
    filter((action) => {
      if (action.type === AuthActionsNames.error) {
        return action.prevAction.type === newPassword.type;
      }
      return true;
    }),
    map((action) => {
      switch (action.type) {
        case AuthActionsNames.newPasswordSuccess:
          return AsyncActionStatus.resolved;
        case AuthActionsNames.error:
          return AsyncActionStatus.rejected;
        default:
          return AsyncActionStatus.awaiting;
      }
    }),
    share()
  )

  constructor(private _actions$: Actions) {}
}
