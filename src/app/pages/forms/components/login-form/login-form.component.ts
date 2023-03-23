import { FormGroup } from '@angular/forms';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginFormControls, LoginService } from '../../services/login.service';
import { map, merge, Observable, Subscription } from 'rxjs';
import { AsyncActionStatus } from 'src/app/state/app.state.utils';
import { FormSubmitter } from 'src/app/utils/form-helper';
import { LoginModel } from 'src/app/state/auth/auth.state';
import { SharedModule } from 'src/app/modules/shared/shared.module';
import { DetachView } from 'src/app/modules/shared/directives/detach-view.directive';
import { FormViewDirective } from '../../../../modules/shared/directives/form-view.directive';
import { Params } from '@angular/router';

@Component({
  selector: 'app-login-form[signingIn\\$][prevUrl\\$][prevQuery\\$][prevFragment\\$]',
  standalone: true,
  imports: [SharedModule],
  hostDirectives: [ DetachView, FormViewDirective ],
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { 'class': 'min-h-[90vh] flex items-center' }
})
export class LoginFormComponent implements OnInit, OnDestroy {

  private _subscription: Subscription;
  private _formSubmitter: FormSubmitter;

  @Input() prevUrl$: Observable<string> = null!;
  @Input() signingIn$: Observable<AsyncActionStatus> = null!
  @Input() prevQuery$: Observable<Params | null> = null!;
  @Input() prevFragment$: Observable<string | undefined> = null!;
  @Output() loginSubmit = new EventEmitter<LoginModel>();

  formGroup: FormGroup<LoginFormControls>;
  submitDisabled$: Observable<boolean> = null!;

  constructor(loginService: LoginService) {
    const { formGroup, subscription } = loginService.getLoginFormGroup();

    this.formGroup = formGroup;
    this._formSubmitter = new FormSubmitter(formGroup);
    this._subscription = subscription;
    this._subscription.add(() => this._formSubmitter.dispose());
  }

  ngOnInit(): void {
    this.submitDisabled$ = merge(
      this._formSubmitter.submitDisabled$,
      this.signingIn$.pipe(map((status) => status === AsyncActionStatus.awaiting))
    );
  }

  onSubmit(): void {
    this._formSubmitter.trySubmit(() => {
      this.loginSubmit.emit(this.formGroup.getRawValue());
    });
  }

  ngOnDestroy(): void {
    this._subscription.unsubscribe();
  }

}
