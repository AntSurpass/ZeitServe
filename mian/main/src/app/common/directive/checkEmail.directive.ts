import { Directive, Input } from '@angular/core';
import { NG_VALIDATORS, Validator, AbstractControl, ValidatorFn } from '@angular/forms';

@Directive({
  selector: '[appCheckEmail]',
  providers: [{provide: NG_VALIDATORS, useExisting: CheckEmailDirective, multi: true}]
})
export class CheckEmailDirective implements Validator {

  reg = /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/i ;
  validate(control: AbstractControl): {[key: string]: any} | null {
    return appCheckEmailValidator(this.reg)(control);
  }

}

export function appCheckEmailValidator(nameRe: RegExp): ValidatorFn {
  return (control: AbstractControl): {[key: string]: any} | null => {
    const forbidden = nameRe.test(control.value);
    return forbidden ?  null : {'CheckEmail': {value: control.value}};
  };
}
