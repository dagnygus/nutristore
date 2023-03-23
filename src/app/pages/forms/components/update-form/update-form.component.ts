import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { map, merge, Observable, ReplaySubject, Subject, Subscription, switchAll } from 'rxjs';
import { AsyncActionStatus } from 'src/app/state/app.state.utils';
import { UpdateUserModel } from 'src/app/state/auth/auth.state';
import { UpdateFormControls, UpdateService } from '../../services/update.service';
import { FormSubmitter } from 'src/app/utils/form-helper';
import { FormGroup } from '@angular/forms';
import { DetachView } from 'src/app/modules/shared/directives/detach-view.directive';
import { FormViewDirective } from '../../../../modules/shared/directives/form-view.directive';
import { SharedModule } from 'src/app/modules/shared/shared.module';
import { Params } from '@angular/router';

@Component({
  selector: 'app-update-form[updating\\$][prevUrl\\$][prevQuery\\$][prevFragment\\$]',
  standalone: true,
  hostDirectives: [ DetachView, FormViewDirective ],
  imports: [SharedModule],
  templateUrl: './update-form.component.html',
  styleUrls: ['./update-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { 'class': 'min-h-[90vh] flex items-center' }
})
export class UpdateFormComponent implements OnDestroy {

  private _updating$$ = new ReplaySubject<Observable<AsyncActionStatus>>(1);
  private _userData$ = new ReplaySubject<UpdateUserModel>(1);
  private _formSubmitter: FormSubmitter;
  private _sampler = new Subject<void>();
  private _subscription: Subscription;

  @Output() updateSubmit = new EventEmitter<UpdateUserModel>();

  @Input() prevUrl$: Observable<string> = null!;
  @Input() prevQuery$: Observable<Params | null> = null!;
  @Input() prevFragment$: Observable<string | undefined> = null!;

  @Input()
  public set updating$(value: Observable<AsyncActionStatus>) {
    this._updating$$.next(value);
  }

  @Input()
  public set userData(value: UpdateUserModel) {
    this._userData$.next(value);
  }

  formGroup: FormGroup<UpdateFormControls>;
  submitDisabled$: Observable<boolean> = null!;

  constructor(private _updateService: UpdateService) {
    const { formGroup, subscription } = this._updateService.getUpdateFormControls(this._sampler);
    this.formGroup = formGroup;
    this._subscription = subscription;

    this._formSubmitter = new FormSubmitter(formGroup);
    this._subscription.add(() => this._formSubmitter.dispose());
    this._subscription.add(this._userData$.subscribe((data) => this.formGroup.setValue(data)));
    this.submitDisabled$ = merge(
      this._formSubmitter.submitDisabled$,
      this._updating$$.pipe(
        switchAll(),
        map((status) => status === AsyncActionStatus.awaiting)
      )
    );
  }

  ngOnDestroy(): void {
    this._sampler.complete();
    this._subscription.unsubscribe();
  }

  onSubmit(): void {
    this._formSubmitter.trySubmit(() => {
      this._sampler.next();
      this.updateSubmit.emit(this.formGroup.getRawValue())
    });
  }
}
