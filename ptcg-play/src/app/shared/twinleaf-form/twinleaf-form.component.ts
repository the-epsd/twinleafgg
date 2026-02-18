import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

export interface TwinleafFormField {
  name: string;
  label: string;
  type: 'text' | 'password' | 'email' | 'number' | 'checkbox' | 'select';
  placeholder?: string;
  required?: boolean;
  validation?: any;
  options?: { value: any; label: string }[];
  hint?: string;
  icon?: string;
  value?: any;
}

@Component({
  selector: 'twinleaf-form',
  templateUrl: './twinleaf-form.component.html',
  styleUrls: ['./twinleaf-form.component.scss']
})
export class TwinleafFormComponent implements OnInit, OnDestroy {
  @Input() fields: TwinleafFormField[] = [];
  @Input() submitText: string = 'Submit';
  @Input() loading: boolean = false;
  @Input() disabled: boolean = false;
  @Input() showValidation: boolean = true;
  @Input() formStyle: 'default' | 'futuristic' | 'minimal' = 'default';

  @Output() formSubmit = new EventEmitter<any>();
  @Output() formChange = new EventEmitter<any>();

  form: UntypedFormGroup;
  submitted = false;

  constructor(
    private fb: UntypedFormBuilder,
    private translate: TranslateService
  ) {
    this.form = this.fb.group({});
  }

  ngOnInit(): void {
    this.buildForm();
  }

  ngOnDestroy(): void {
    // Cleanup if needed
  }

  private buildForm(): void {
    const formControls: { [key: string]: any } = {};

    this.fields.forEach(field => {
      const validators = [];

      if (field.required) {
        validators.push(Validators.required);
      }

      if (field.validation) {
        validators.push(field.validation);
      }

      const defaultValue = field.value !== undefined
        ? field.value
        : (field.type === 'checkbox' ? false : '');
      formControls[field.name] = [defaultValue, validators];
    });

    this.form = this.fb.group(formControls);

    // Emit form changes
    this.form.valueChanges.subscribe(value => {
      this.formChange.emit(value);
    });
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.form.valid && !this.loading && !this.disabled) {
      this.formSubmit.emit(this.form.value);
    }
  }

  getFieldError(fieldName: string): string {
    const field = this.form.get(fieldName);
    if (field && field.errors && this.submitted) {
      const translatedLabel = this.getTranslatedLabel(fieldName);
      if (field.errors['required']) {
        return `${translatedLabel} is required`;
      }
      if (field.errors['email']) {
        return 'Please enter a valid email address';
      }
      if (field.errors['minlength']) {
        return `${translatedLabel} must be at least ${field.errors['minlength'].requiredLength} characters`;
      }
      if (field.errors['maxlength']) {
        return `${translatedLabel} must not exceed ${field.errors['maxlength'].requiredLength} characters`;
      }
      if (field.errors['name']) {
        return this.translate.instant('VALIDATION_INVALID_NAME_FORMAT');
      }
      if (field.errors['password']) {
        return this.translate.instant('VALIDATION_INVALID_PASSWORD_FORMAT');
      }
      if (field.errors['passwordMatch']) {
        return this.translate.instant('VALIDATION_PASSWORD_MATCH');
      }
    }
    return '';
  }

  getFieldLabel(fieldName: string): string {
    const field = this.fields.find(f => f.name === fieldName);
    return field ? field.label : fieldName;
  }

  getTranslatedLabel(fieldName: string): string {
    const field = this.fields.find(f => f.name === fieldName);
    if (field) {
      return this.translate.instant(field.label);
    }
    return fieldName;
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.form.get(fieldName);
    return !!(field && field.invalid && this.submitted);
  }

  isFieldValid(fieldName: string): boolean {
    const field = this.form.get(fieldName);
    return !!(field && field.valid && this.submitted);
  }
}
