import { NewPasswordModel } from './../../../state/auth/auth.state';
import { Injectable } from "@angular/core";
import { FormControl, FormGroup, NonNullableFormBuilder, Validators } from "@angular/forms";
import { compareValidator, distinctValidator, validationWithMessage } from 'src/app/utils/form-helper';

export type NewPasswordControls = { [key in keyof NewPasswordModel]: FormControl<NewPasswordModel[key]> };

@Injectable()
export class NewPasswordService {
  constructor(private _formBuilder: NonNullableFormBuilder) {}

  getNewPasswordFormGroup(): FormGroup<NewPasswordControls> {
    const formGroup = this._formBuilder.group<NewPasswordControls>({
      oldPassword: this._formBuilder.control('', [
        validationWithMessage(Validators.required, 'Old password is required!'),
        validationWithMessage(Validators.minLength(5), 'Old password must contain minimum 5 characters!')
      ]),
      newPassword: this._formBuilder.control('', [
        validationWithMessage(Validators.required, 'New password is required!'),
        validationWithMessage(Validators.minLength(5), 'New password must contain minimum 5 characters!'),
        distinctValidator('oldPassword', 'New password can not be the same!')
      ]),
      confirmPassword: this._formBuilder.control('', [
        validationWithMessage(Validators.required, 'Password confirmation is required!'),
        compareValidator('newPassword', 'Password not match!')
      ]),
    });

    return formGroup
  }
}
