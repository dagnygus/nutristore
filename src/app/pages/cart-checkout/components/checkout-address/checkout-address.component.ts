import { LocalStorageService } from './../../../../modules/core/services/localstorage.service';
import { audit, distinctUntilChanged, filter, subscribeOn, switchMap, take, tap } from 'rxjs/operators';
import { DetachView } from './../../../../modules/shared/directives/detach-view.directive';
import { SharedModule } from 'src/app/modules/shared/shared.module';
import { ChangeDetectionStrategy, Component, Input, OnDestroy, ViewEncapsulation, Output, EventEmitter } from '@angular/core';
import { map, merge, Observable, ReplaySubject, Subject, Subscription, switchAll, asyncScheduler, of, BehaviorSubject } from 'rxjs';
import { AddressData } from '../../cart-checkout.component';
import { FormControl, FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms';
import { FormSubmitter, setTrimSanitizer, validationWithMessage } from 'src/app/utils/form-helper';
import { Router, NavigationEnd } from '@angular/router';
import { FormViewDirective } from 'src/app/modules/shared/directives/form-view.directive';

const _distinctAddressData = (prev: AddressData, next: AddressData) => {
  return prev.city === next.city &&
  prev.street === next.street &&
  prev.state === next.state &&
  prev.country === next.country
}

@Component({
  selector: 'app-checkout-address',
  standalone: true,
  imports: [SharedModule],
  hostDirectives: [ DetachView, FormViewDirective ],
  templateUrl: './checkout-address.component.html',
  styleUrls: ['./checkout-address.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class CheckoutAddressComponent implements OnDestroy {

  private _subcription: Subscription;
  private _sanitizationSampler = new Subject<void>();
  private _addressData$$ = new ReplaySubject<Observable<AddressData>>(1)
  private _addressData$: Observable<AddressData> = null!;
  private _changeData$$ = new ReplaySubject<Observable<boolean>>(1);
  private _formSubmitter: FormSubmitter;


  formGroup: FormGroup<{ [key in keyof AddressData]: FormControl<AddressData[key]> }>
  editData$: Observable<boolean>;
  currentValue$ = new ReplaySubject<AddressData>(1);

  @Input()
  set addressData$(value: Observable<AddressData>) {
    this._addressData$ = value;
    this._addressData$$.next(value);
  }
  get addressData$(): Observable<AddressData> {
    return this._addressData$;
  }

  @Input()
  public set changeData$(value: Observable<boolean>) {
    this._changeData$$.next(value);
  }

  @Output() editDone = new EventEmitter<void>();

  constructor(fromBuilder: NonNullableFormBuilder,) {

    this.formGroup = fromBuilder.group({
      city: fromBuilder.control('', validationWithMessage(Validators.required, 'City is required!')),
      street: fromBuilder.control('', validationWithMessage(Validators.required, 'Street is required!')),
      state: fromBuilder.control('', validationWithMessage(Validators.required, 'State is required!')),
      country: fromBuilder.control('', validationWithMessage(Validators.required, 'Country is required!')),
    });

    this._formSubmitter = new FormSubmitter(this.formGroup);

    this._subcription = setTrimSanitizer(this.formGroup.controls.city, this._sanitizationSampler);
    this._subcription.add(setTrimSanitizer(this.formGroup.controls.street, this._sanitizationSampler));
    this._subcription.add(setTrimSanitizer(this.formGroup.controls.state, this._sanitizationSampler));
    this._subcription.add(setTrimSanitizer(this.formGroup.controls.country, this._sanitizationSampler));
    this._subcription.add(this._addressData$$.pipe(switchAll()).subscribe((value) => this.formGroup.setValue(value)));

    this._subcription.add(
      this._addressData$$.pipe(switchAll()).subscribe((value) => this.formGroup.setValue(value))
    );

    this._subcription.add(
      this.formGroup.valueChanges.pipe(map(() => this.formGroup.getRawValue())).subscribe(this.currentValue$)
    );


    this.editData$ = this._changeData$$.pipe(switchAll());
  }

  onSubmit(): void {
    this._sanitizationSampler.next();
    this._formSubmitter.trySubmit(() => {
      this.editDone.emit();
    })
  }
  onCancel(): void {
    this._addressData$$.next(this.addressData$);
    this.editDone.emit();
  }

  ngOnDestroy(): void {
    this._subcription.unsubscribe();
    this._formSubmitter.dispose();
  }
}
