import { Injectable } from '@angular/core';
import { FormControl, FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { UpdateUserModel } from 'src/app/state/auth/auth.state';
import { setTrimSanitizer, setTrimTitleSanitizer, validationWithMessage } from 'src/app/utils/form-helper';

export type UpdateFormControls = { [key in keyof UpdateUserModel]: FormControl<UpdateUserModel[key]>}

@Injectable()
export class UpdateService {
  constructor(private _formBuilder: NonNullableFormBuilder) {}

  getUpdateFormControls(sanitizionSampler: Observable<void | unknown>): { formGroup: FormGroup<UpdateFormControls>, subscription: Subscription } {
    const formGroup = this._formBuilder.group<UpdateFormControls>({
      firstName: this._formBuilder.control('', [
        validationWithMessage(Validators.required, 'First name is required!'),
        validationWithMessage(Validators.minLength(3), 'First name must contain minimum tree characters!'),
      ]),
      lastName: this._formBuilder.control('', [
        validationWithMessage(Validators.required, 'Last name is required!'),
        validationWithMessage(Validators.minLength(3), 'Last name must contain minimum tree characters!'),
      ]),
      email: this._formBuilder.control('', [
        validationWithMessage(Validators.required, 'Address E-mail is required!'),
        validationWithMessage(Validators.email, 'Incorect fromat of address e-mail!')
      ]),
      city: this._formBuilder.control('', validationWithMessage(Validators.required, 'City is required!')),
      street: this._formBuilder.control('', validationWithMessage(Validators.required, 'Street is required!')),
      state: this._formBuilder.control('', validationWithMessage(Validators.required, 'State is required!')),
      country: this._formBuilder.control('', validationWithMessage(Validators.required, 'Country is required!')),
      zipCode: this._formBuilder.control('', validationWithMessage(Validators.required, 'Zip-Code is required!')),
    });

    const subscription = setTrimTitleSanitizer(formGroup.controls.firstName);
    subscription.add(setTrimTitleSanitizer(formGroup.controls.lastName));
    subscription.add(setTrimSanitizer(formGroup.controls.email));
    subscription.add(setTrimSanitizer(formGroup.controls.city, sanitizionSampler));
    subscription.add(setTrimSanitizer(formGroup.controls.street, sanitizionSampler));
    subscription.add(setTrimSanitizer(formGroup.controls.state, sanitizionSampler));
    subscription.add(setTrimSanitizer(formGroup.controls.country, sanitizionSampler));
    subscription.add(setTrimSanitizer(formGroup.controls.zipCode, sanitizionSampler));

    return { formGroup, subscription }
  }
}
