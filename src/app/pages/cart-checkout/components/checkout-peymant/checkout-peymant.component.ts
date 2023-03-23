import { validationWithMessage } from './../../../../utils/form-helper';
import { DetachView } from './../../../../modules/shared/directives/detach-view.directive';
import { ChangeDetectionStrategy, Component, OnDestroy, Output, ViewEncapsulation, EventEmitter } from '@angular/core';
import { SharedModule } from 'src/app/modules/shared/shared.module';
import { FormViewDirective } from 'src/app/modules/shared/directives/form-view.directive';
import { FormGroup, NonNullableFormBuilder, FormControl, ValidationErrors, AbstractControl, Form, Validators } from '@angular/forms';
import { map, Subscription } from 'rxjs';
import { FormSubmitter } from 'src/app/utils/form-helper';

@Component({
  selector: 'app-checkout-peymant',
  standalone: true,
  imports: [SharedModule],
  hostDirectives: [DetachView, FormViewDirective],
  templateUrl: './checkout-peymant.component.html',
  styleUrls: ['./checkout-peymant.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: { 'class': 'w-full' }
})
export class CheckoutPeymantComponent implements OnDestroy {

  private _subscription: Subscription
  private _formSubmitter: FormSubmitter;

  @Output() accept = new EventEmitter<void>();

  formGroup: FormGroup<{ cartNumber: FormControl<string>; cvc: FormControl<string>; expirationDate: FormControl<string> }>

  constructor(formBuilder: NonNullableFormBuilder) {
    this.formGroup = formBuilder.group({
      cartNumber: formBuilder.control('', [
        validationWithMessage(Validators.required, 'Card number is required!'),
        _cartNumberValidator
      ]),
      cvc: formBuilder.control('', [
        validationWithMessage(Validators.required, 'CVC code is required!'),
        _cvcValidator
      ]),
      expirationDate: formBuilder.control('',[
        validationWithMessage(Validators.required, 'Date is required!'),
        _dateValidator
      ]),
    });

    this._formSubmitter = new FormSubmitter(this.formGroup);

    this._subscription = _cartNumberSanitizer(this.formGroup.controls.cartNumber);
    this._subscription.add(_cvcSanitizer(this.formGroup.controls.cvc));
    this._subscription.add(_dateSanitizer(this.formGroup.controls.expirationDate));
  }

  onSubmit(): void {
    this._formSubmitter.trySubmit(() => {
      this.accept.emit();
    });
  }

  ngOnDestroy(): void {
    this._subscription.unsubscribe();
    this._formSubmitter.dispose();
  }
}

const NUMBER_REGEX = /^[0-9]*$/g;
const IVERTED_NUMBER_REGEX = /[^0-9]/g;

function _cartNumberValidator(control: AbstractControl<string>): ValidationErrors | null {
  const value = control.value.replaceAll(' ', '');

  if (!NUMBER_REGEX.test(value)) {
    return { cartNumber: 'Incorect format!' };
  }

  if (value.length !== 16) {
    return { cartNumber: 'Cart number must contain 16 digits!' };
  }

  return null;
}

function _cvcValidator(control: AbstractControl<string>): ValidationErrors | null {
  const value = control.value.trim();
  if (!NUMBER_REGEX.test(value)) {
    return { cvc: 'Invalid cvc!' }
  }

  if (value.length !== 3) {
    return { cvc: 'CVC must contain 3 digits!' }
  }

  return null
}

function _dateValidator(control: AbstractControl<string>): ValidationErrors | null {
    const value = control.value.replaceAll('/', '');

    if (!NUMBER_REGEX.test(value)) {
      return { date: 'Invalid date format!' };
    }

    return null;
}

function _cartNumberSanitizer(control: FormControl<string>): Subscription {

  let lastValue = '';

  return control.valueChanges.pipe(map((value) => {

    if (value.length === lastValue.length - 1 &&
        lastValue.startsWith(value)) {
        if (value.endsWith(' '))
        value = value.substring(0, value.length - 1);
      return value
    }

    if (!NUMBER_REGEX.test(value)) {
      value = value.replace(IVERTED_NUMBER_REGEX, '');
    }

    value = value.split('').reduce((acc, next, index) => {
      if (index !== 0 && !(index % 4)) { next = ' ' + next; };
      return acc + next
    }, '');

    if (value.length > 19) {
      value = value.substring(0, 19);
    }

    return value
  })).subscribe((value) => {
    if (value !== control.value) {
      control.setValue(value);
      lastValue = value;
    }
  })
}

function _cvcSanitizer(control: AbstractControl<string>): Subscription {
  return control.valueChanges.pipe(map((value) => {
    value = value.trim();

    if (!NUMBER_REGEX.test(value)) {
      value = value.replace(IVERTED_NUMBER_REGEX, '');
    }

    if (value.length > 3) {
      value = value.substring(0, 3);
    }

    return value
  })).subscribe((value) => {
    if (value !== control.value) {
      control.setValue(value);
    }
  })
}

function _dateSanitizer(control: AbstractControl<string>) {
  let lastValue = ''

  return control.valueChanges.pipe(map((value) => {

    if (value.length === lastValue.length - 1 && lastValue.startsWith(value)) {
      if (value.endsWith('/')) { value = value.substring(0, value.length - 1); }
      return value;
    }

    if (!NUMBER_REGEX.test(value)) {
      value = value.replace(IVERTED_NUMBER_REGEX, '');
    }

    value = value.split('').reduce((acc, next, index) => {
      if (index !== 0 && index <= 4 && !(index % 2)) { next = '/' + next; }
      return acc + next;
    }, '');

    if (value.length > 10) {
      value = value.substring(0, 10);
    }

    return value;
  })).subscribe((value) => {
    if (value !== control.value) {
      control.setValue(value);
      lastValue = value
    }
  })
}
