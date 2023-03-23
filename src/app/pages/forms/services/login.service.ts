import { validationWithMessage, setTrimSanitizer } from './../../../utils/form-helper';
import { Injectable } from "@angular/core";
import { FormControl, FormGroup, NonNullableFormBuilder, Validators } from "@angular/forms";
import { LoginModel } from "src/app/state/auth/auth.state";
import { Subscription } from 'rxjs';

export type LoginFormControls = { [key in keyof LoginModel]: FormControl }

@Injectable()
export class LoginService {
  constructor(private _formBuilder: NonNullableFormBuilder) {}

  getLoginFormGroup(): { formGroup: FormGroup<LoginFormControls>, subscription: Subscription } {
    const formGroup = this._formBuilder.group<LoginFormControls>({
      email: this._formBuilder.control('', [
        validationWithMessage(Validators.required, 'Address E-Mail is required!'),
        validationWithMessage(Validators.email, 'Incorect format of address e-mail')
      ]),
      password: this._formBuilder.control('', [
        validationWithMessage(Validators.required, 'Password is required!'),
        validationWithMessage(Validators.minLength(5), 'Password must contain minimum 5 characters!')
      ])
    });

    const subscription = setTrimSanitizer(formGroup.controls.email);

    return { formGroup, subscription }
  }
}
