import { NewPasswordModel } from './../../../../state/auth/auth.state';
import { AsyncActionStatus } from './../../../../state/app.state.utils';
import { map, merge, Observable } from 'rxjs';
import { FormGroup } from '@angular/forms';
import { NewPasswordService, NewPasswordControls } from './../../services/new-password.service';
import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit, Output, EventEmitter } from '@angular/core';
import { DetachView } from 'src/app/modules/shared/directives/detach-view.directive';
import { SharedModule } from 'src/app/modules/shared/shared.module';
import { FormViewDirective } from '../../../../modules/shared/directives/form-view.directive';
import { FormSubmitter } from 'src/app/utils/form-helper';
import { Params } from '@angular/router';

@Component({
  selector: 'app-new-password-form[passwordChanging\\$][prevUrl\\$][prevQuery\\$][prevFragment\\$]',
  standalone: true,
  imports: [SharedModule],
  hostDirectives: [ DetachView, FormViewDirective ],
  templateUrl: './new-password-form.component.html',
  styleUrls: ['./new-password-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { 'class': 'min-h-[90vh] flex items-center' }
})
export class NewPasswordFormComponent implements OnInit, OnDestroy {

  private _formSubmitter: FormSubmitter

  @Input() prevUrl$: Observable<string> = null!;
  @Input() prevQuery$: Observable<Params | null> = null!;
  @Input() prevFragment$: Observable<string | undefined> = null!;
  @Input() passwordChanging$: Observable<AsyncActionStatus> = null!;
  @Output() passwordSubmit = new EventEmitter<NewPasswordModel>();

  formGroup: FormGroup<NewPasswordControls>;
  submitDisabled$: Observable<boolean> = null!;

  constructor(newPasswordService: NewPasswordService) {
    this.formGroup = newPasswordService.getNewPasswordFormGroup();
    this._formSubmitter = new FormSubmitter(this.formGroup);
  }

  ngOnInit(): void {
    this.submitDisabled$ = merge(
      this._formSubmitter.submitDisabled$,
      this.passwordChanging$.pipe(map((status) => status === AsyncActionStatus.awaiting))
    );
  }

  ngOnDestroy(): void {
    this._formSubmitter.dispose();
  }

  onSubmit(): void {
    this._formSubmitter.trySubmit(() => {
      this.passwordSubmit.emit(this.formGroup.getRawValue());
    })
  }
}
