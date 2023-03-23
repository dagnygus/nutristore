import { map, merge, Observable, ReplaySubject, Subscription, switchAll } from 'rxjs';
import { Subject } from 'rxjs';
import { FormGroup } from '@angular/forms';
import { RegisterOrUpdateService, RegisterFormContols } from '../../services/register-or-update.service';
import { DetachView } from 'src/app/modules/shared/directives/detach-view.directive';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { AsyncActionStatus } from 'src/app/state/app.state.utils';
import { FormSubmitter } from 'src/app/utils/form-helper';
import { SharedModule } from 'src/app/modules/shared/shared.module';
import { FormViewDirective } from '../../../../modules/shared/directives/form-view.directive';
import { RegisterModel } from 'src/app/state/auth/auth.state';
import { Params } from '@angular/router';

@Component({
  selector: 'app-register-update-form[singingUp\\$][prevUrl\\$][prevQuery\\$][prevFragment\\$]',
  templateUrl: './register-update-form.component.html',
  styleUrls: ['./register-update-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  hostDirectives: [ DetachView, FormViewDirective ],
  imports: [ SharedModule ],
  host: { 'class': 'min-h-[90vh] flex items-center' }
})
export class RegisterUpdateFormComponent implements OnDestroy {

  private _singingUp$$ = new ReplaySubject<Observable<AsyncActionStatus>>(1);
  private _formSubmitter: FormSubmitter;
  private _sampler = new Subject<void>();
  private _subscription: Subscription;

  @Output() registerSubmit = new EventEmitter<RegisterModel>();

  @Input() prevUrl$: Observable<string> = null!;
  @Input() prevQuery$: Observable<Params | null> = null!;
  @Input() prevFragment$: Observable<string | undefined> = null!;

  @Input()
  public set singingUp$(value: Observable<AsyncActionStatus>) {
    this._singingUp$$.next(value);
  }

  formGroup: FormGroup<RegisterFormContols>;
  submitDisabled$: Observable<boolean>;

  constructor(registerOrUpdateService: RegisterOrUpdateService) {
    const { formGroup, subscription } = registerOrUpdateService.getFormGroup(this._sampler);
    this.formGroup = formGroup;
    this._subscription = subscription;

    this._formSubmitter = new FormSubmitter(formGroup);
    this._subscription.add(() => this._formSubmitter.dispose());
    this.submitDisabled$ = merge(
      this._formSubmitter.submitDisabled$,
      this._singingUp$$.pipe(
        switchAll(),
        map((status) => status === AsyncActionStatus.awaiting)
      )
    )
  }

  ngOnDestroy(): void {
    this._sampler.complete();
    this._subscription.unsubscribe();
  }

  onSubmit(): void {
    this._formSubmitter.trySubmit(() => {
      this._sampler.next();
      this.registerSubmit.emit(this.formGroup.getRawValue())
    });
  }
}
