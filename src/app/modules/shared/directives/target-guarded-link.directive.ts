import { AfterContentInit, Directive, HostListener, Inject, Injectable, InjectionToken, OnDestroy, OnInit, Self } from "@angular/core";
import { Router, RouterLink } from "@angular/router";

@Directive({ selector: 'a[routerLink][guardedLink]' })
export class TargetGuardedLink implements OnInit {
  private _targetGuardedLink: string | null = null;

  constructor(@Self() private _routerLinkDirective: RouterLink,
              @Inject(GUARDED_URL_PROVIDER) private _guardedUrlProvider: GuardedUrlProvider) {
  }

  ngOnInit(): void {
    if (!this._routerLinkDirective.href) { return; }
    this._targetGuardedLink = this._routerLinkDirective.href;
  }

  @HostListener('click')
  onClick(): void {
    this._guardedUrlProvider.url = this._targetGuardedLink;
  }
}

export interface GuardedUrlProvider { url: string | null }

const _gaurdedUrlProvider: GuardedUrlProvider = { url: null };

export const GUARDED_URL_PROVIDER = new InjectionToken('GUARDED_LINK_PROVIDER', {
  providedIn: 'root',
  factory: () => _gaurdedUrlProvider
});
