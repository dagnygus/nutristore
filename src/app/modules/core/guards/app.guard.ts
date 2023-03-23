import { AuthStateRef } from '../../../state/auth/auth.state';
import { RouterStateRef } from '../../../state/router/router-serializer';
import { inject } from '@angular/core';
import { CanActivateFn, CanMatchFn, Router } from "@angular/router";

export const FormsCanActivated: CanActivateFn = (_, state) => {
  const authStateRef = inject(AuthStateRef)
  const url = state.url
  const router = inject(Router);
  const routerStateRef = inject(RouterStateRef);
  if (authStateRef.state.authUser) {
    if (url.endsWith('login') || url.endsWith('register')) {
      if (routerStateRef.navigationId > 1) {
        return router.parseUrl(routerStateRef.state.url);
      }
      return router.parseUrl('/');
    }
    return true;
  } else {
    if (url.endsWith('update') || url.endsWith('password')) {
      return false;
    }
    return true;
  }
}

export const FormsCanMatch: CanMatchFn = (_, segments) => {
  const authStateRef = inject(AuthStateRef)
  const router = inject(Router);
  const routerStateRef = inject(RouterStateRef);
  const url = '/' + segments.map((segment) => segment.path).join('/');

  if (url.endsWith('login') || url.endsWith('register')) {
    if (authStateRef.state.authUser) {
      if (routerStateRef.navigationId > 1) {
        return router.parseUrl(routerStateRef.state.url);
      }
      return router.parseUrl('/');
    } else {
      return true;
    }
  }

  if (url.endsWith('update') || url.endsWith('password')) {
    if (!authStateRef.state.authUser) {
      if (routerStateRef.navigationId > 1) {
        return router.parseUrl(routerStateRef.state.url);
      }
      return router.parseUrl('/');
    } else {
      return true;
    }
  }

  return false;

  // if (authStateRef.state.authUser) {
  //   if (url.endsWith('login') || url.endsWith('register')) {
  //     if (!unauthGuardedPaths.has(url)) {
  //       unauthGuardedPaths.add(url);
  //     }
  //     if (routerStateRef.navigationId > 1) {
  //       return router.parseUrl(routerStateRef.state.url);
  //     }
  //     return router.parseUrl('/');
  //   }
  //   return true;
  // } else {
  //   if (url.endsWith('update') || url.endsWith('password')) {
  //     if (!authGuardedPaths.has(url)) {
  //       authGuardedPaths.add(url);
  //     }
  //     return router.parseUrl('/forms/login');
  //   }
  //   return true;
  // }
}

export const AccountCanActivated: CanActivateFn = (_, state) => {
  const authStateRef = inject(AuthStateRef);
  const router = inject(Router);

  return authStateRef.state.authUser !== null ? true : router.parseUrl('/forms/login');
}

export const AccountCanMatch: CanMatchFn = (_, segments) => {
  const authStateRef = inject(AuthStateRef);
  const router = inject(Router);

  return authStateRef.state.authUser !== null ? true : router.parseUrl('/forms/login');
}
