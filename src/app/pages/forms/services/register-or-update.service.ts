import { compareValidator, validationWithMessage, setTrimTitleSanitizer, setTrimSanitizer } from './../../../utils/form-helper';
import { Injectable } from "@angular/core";
import { FormControl, FormGroup, NonNullableFormBuilder, Validators } from "@angular/forms";
import { RegisterModel } from "src/app/state/auth/auth.state";
import { Observable, Subscription } from 'rxjs';

export type RegisterFormContols = { [key in keyof RegisterModel]: FormControl<RegisterModel[key]> }

@Injectable()
export class RegisterOrUpdateService {
  constructor(private _formBuilder: NonNullableFormBuilder) {}

  getFormGroup(sanitizionSampler: Observable<void | unknown>): { formGroup: FormGroup<RegisterFormContols>, subscription: Subscription } {
    const formGroup = this._formBuilder.group<RegisterFormContols>({
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
      password: this._formBuilder.control('', [
        validationWithMessage(Validators.required, 'Password is required!'),
        validationWithMessage(Validators.minLength(5), 'Password must contain minimum 5 characters!')
      ]),
      confirmPassword: this._formBuilder.control('', [
        validationWithMessage(Validators.required, 'Password confirmation is required!'),
        compareValidator('password', 'Password not match!')
      ]),
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
