import { Directive } from '@angular/core';
import { NG_VALIDATORS, AbstractControl, Validator, ValidationErrors } from '@angular/forms';

// Updated pattern to accept:
// - http:// or https://
// - IP addresses
// - localhost
// - domain names with hyphens and underscores
// - optional port numbers
const addressPattern = /^https?:\/\/(localhost|(\d{1,3}\.){3}\d{1,3}|[a-zA-Z0-9][a-zA-Z0-9-_.]*(\.[a-zA-Z0-9][a-zA-Z0-9-_.]*)*)(:\d+)?$/;

@Directive({
  selector: '[ptcgAddressValidator][ngModel]',
  providers: [{ provide: NG_VALIDATORS, useExisting: AddressValidatorDirective, multi: true }]
})
export class AddressValidatorDirective implements Validator {

  validate(control: AbstractControl): ValidationErrors {
    const value: string = control.value;
    return addressPattern.test(value) ? null : { address: true };
  }

}
