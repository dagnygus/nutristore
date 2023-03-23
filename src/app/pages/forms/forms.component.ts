import { commonApearanceAnimation } from './../../utils/common-ng-aniamtions';
import { GUARDED_URL_PROVIDER, GuardedUrlProvider } from './../../modules/shared/directives/target-guarded-link.directive';
import { RouterStateRef } from './../../state/router/router-serializer';
import { NewPasswordModel } from './../../state/auth/auth.state';
import { NewPasswordFormComponent } from './components/new-password-form/new-password-form.component';
import { NewPasswordService } from './services/new-password.service';
import { UpdateFormComponent } from './components/update-form/update-form.component';
import { UpdateService } from './services/update.service';
import { signup, signin, updateUserData, newPassword } from './../../state/auth/auth.actions';
import { ChangeDetectionStrategy, Component, ViewEncapsulation, OnInit, Inject, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd, Params } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { map, Observable, share, asyncScheduler, subscribeOn, filter, take, tap, of, Subscription, merge } from 'rxjs';
import { DetachView } from 'src/app/modules/shared/directives/detach-view.directive';
import { SharedModule } from 'src/app/modules/shared/shared.module';
import { AppState } from 'src/app/state/app.state';
import { AsyncActionStatus } from 'src/app/state/app.state.utils';
import { AuthEvents } from 'src/app/state/auth/auth.effects';
import { LoginModel, RegisterModel, UpdateUserModel } from 'src/app/state/auth/auth.state';
import { LoginFormComponent } from './components/login-form/login-form.component';
import { RegisterUpdateFormComponent } from './components/register-update-form/register-update-form.component';
import { LoginService } from './services/login.service';
import { RegisterOrUpdateService } from './services/register-or-update.service';
import { LoadingIndicatorService } from 'src/app/modules/core/services/loading-indicator.service';
import { trigger } from '@angular/animations';

const formsAnimationMetadata = trigger('formsContent', commonApearanceAnimation)

@Component({
  selector: 'app-forms',
  templateUrl: './forms.component.html',
  styleUrls: ['./forms.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  hostDirectives: [DetachView],
  host: { 'class': 'page grid items-start' },
  imports: [
    SharedModule,
    RegisterUpdateFormComponent,
    LoginFormComponent,
    UpdateFormComponent,
    NewPasswordFormComponent
  ],
  providers: [
    RegisterOrUpdateService,
    LoginService,
    UpdateService,
    NewPasswordService
  ],
  animations: [formsAnimationMetadata]
})
export class FormsComponent implements OnDestroy {

  private _subscription: Subscription;

  isRegister$: Observable<boolean>;
  isLogin$: Observable<boolean>;
  isUpdate$: Observable<boolean>;
  isNewPassword$: Observable<boolean>;

  prevUrl$: Observable<string>;
  prevFragment$: Observable<string | undefined>;
  prevQuery$: Observable<Params | null>;

  signingUp$: Observable<AsyncActionStatus>;
  signingIn$: Observable<AsyncActionStatus>;
  updating$: Observable<AsyncActionStatus>;
  changingPassword$: Observable<AsyncActionStatus>;

  userData$: Observable<UpdateUserModel>;


  private __guargedUrl__: string | null = null;
  private get _guargedUrl(): string | null {
    if (this.__guargedUrl__ !== null) { return this.__guargedUrl__; }
    if (!localStorage) { return null; }
    const guardedUrl = localStorage.getItem('GUARDED_URL');
    if (guardedUrl === null) { return null; }
    this.__guargedUrl__ = guardedUrl;
    return this.__guargedUrl__;
  }
  private set _guargedUrl(value: string | null) {
    this.__guargedUrl__ = value;
    if (!localStorage) { return; }
    if (value === null) {
      localStorage.removeItem('GUARDED_URL');
    } else {
      localStorage.setItem('GUARDED_URL', value);
    }
  }

  private __prevUrl__: string | null = null;
  private get _prevUrl(): string | null {
    if (this.__prevUrl__ !== null) { return this.__prevUrl__; }
    if (!localStorage) { return null; }
    const prevUrl = localStorage.getItem('PREV_URL');
    if (prevUrl === null) { return null; }
    this.__prevUrl__ = prevUrl;
    return this.__prevUrl__;
  }
  private set _prevUrl(value: string | null) {
    this.__prevUrl__ = value;
    if (value === null) {
      localStorage.removeItem('PREV_URL');
    } else {
      localStorage.setItem('PREV_URL', value);
    }
  }


  constructor(authEvents: AuthEvents,
              activatedRoute: ActivatedRoute,
              private _router: Router,
              routerStateRef: RouterStateRef,
              @Inject(GUARDED_URL_PROVIDER) guardedUrlProvider: GuardedUrlProvider,
              private _store: Store<AppState>,
              loadingIndicatorService: LoadingIndicatorService) {

    if (guardedUrlProvider.url) {
      this._guargedUrl = guardedUrlProvider.url
    }

    if (routerStateRef.state.prevData) {
      if (!routerStateRef.state.prevData.url.startsWith('/forms')) {
        this._prevUrl = routerStateRef.state.prevData.url;
      }
    }

    const { path, queryParams, fragment } = this._praseUrl(this._prevUrl);

    this.prevUrl$ = of(path);
    this.prevQuery$ = of(queryParams);
    this.prevFragment$ = of(fragment);

    const navigateToGuardedOrBack = (status: AsyncActionStatus) => setTimeout(() => {
      if (status !== AsyncActionStatus.resolved) { return; }
      const url = this._guargedUrl || this._prevUrl || '/';
      _router.navigateByUrl(url);
    });

    const navigateBack = (status: AsyncActionStatus) => setTimeout(() => {
      if (status !== AsyncActionStatus.resolved) { return; }
      const url = this._prevUrl || '/';
      _router.navigateByUrl(url);
    });

    this.signingUp$ = authEvents.signingUp$.pipe(tap(navigateToGuardedOrBack));
    this.signingIn$ = authEvents.signingIn$.pipe(tap(navigateToGuardedOrBack));
    this.updating$ = authEvents.updating$.pipe(tap(navigateBack));
    this.changingPassword$ = authEvents.changingPassword$.pipe(tap(navigateBack));

    const source = activatedRoute.params.pipe(
      map((params) => params['auth']),
      subscribeOn(asyncScheduler),
      share()
    )

    this.isRegister$ = source.pipe(map((param) => param === 'register'));
    this.isLogin$ = source.pipe(map((param) => param === 'login'));
    this.isUpdate$ = source.pipe(map((param) => param === 'update'));
    this.isNewPassword$ = source.pipe(map((param) => param === 'password'));

    this.userData$ = _store.pipe(
      select(({ auth }) => auth.authUser!),
      filter((userData) =>  userData !== null),
      map((userData) => {
        const { firstName, lastName, email, city, street, state, country, zipCode } = userData;
        return { firstName, lastName, email, city, street, state, country, zipCode }
      }),
    );

    this._subscription = _router.events.pipe(
      filter((e) => e instanceof NavigationEnd),
      subscribeOn(asyncScheduler),
      take(1)
    ).subscribe(() => {
      this._guargedUrl = null;
      this._prevUrl = null;
      guardedUrlProvider.url = null;
    });

    this._subscription.add(merge(
      this.signingIn$,
      this.signingUp$,
      this.updating$,
      this.changingPassword$
    ).subscribe((status) => {
      if (status === AsyncActionStatus.awaiting) {
        loadingIndicatorService.attach();
      } else {
        loadingIndicatorService.detach();
      }
    }));
  }

  ngOnDestroy(): void {
    this._subscription.unsubscribe();
  }

  onRegisterSubmit(data: RegisterModel): void {
    this._store.dispatch(signup({ data, info: 'Register from register form in forms page' }));
  }

  onLoginSubmit(data: LoginModel): void {
    this._store.dispatch(signin({ data, info: 'Login from login form in forms page' }));
  }

  onUpdateSubmit(data: UpdateUserModel): void {
    this._store.dispatch(updateUserData({ data, info: 'Updating user from forms page' }))
  }

  onPasswordSubmit(data: NewPasswordModel): void {
    this._store.dispatch(newPassword({ data, info: 'Changin password in forms page' }))
  }

  onCancel(): void {
    this._router.navigateByUrl(this._prevUrl ?? '/');
  }



  _praseUrl(url: string | null): { path: string; queryParams: Params | null, fragment: string | undefined } {
    if (url === null) { return { path: '/', queryParams: null, fragment: undefined } }
    if (url.includes('#')) {
      const [ path, fragment ] = url.split('#')

      if (path.includes('?')) {
        const [ clearedPath, queryString ] = path.split('?');
        const qparams: Params = {};
        queryString.split('&').forEach((q) => {
          const [ key, value ] = q.split('=')
          qparams[key] = value;
        });
        return { path: clearedPath, queryParams: qparams, fragment };
      } else {
        return { path, queryParams: null, fragment };
      }

    } else {

      if (url.includes('?')) {
        const [ clearedPath, queryString ] = url.split('?');
        const qparams: Params = {};
        queryString.split('&').forEach((q) => {
          const [ key, value ] = q.split('=')
          qparams[key] = value;
        });
        return { path: clearedPath, queryParams: qparams, fragment: undefined };

      } else {
        return { path: url, queryParams: null, fragment: undefined };
      }

    }
  }

}
