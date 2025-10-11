import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

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

  form: FormGroup;

  constructor(private fb: FormBuilder) {
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

      formControls[field.name] = [field.type === 'checkbox' ? false : '', validators];
    });

    this.form = this.fb.group(formControls);

    // Emit form changes
    this.form.valueChanges.subscribe(value => {
      this.formChange.emit(value);
    });
  }

  onSubmit(): void {
    if (this.form.valid && !this.loading && !this.disabled) {
      this.formSubmit.emit(this.form.value);
    }
  }

  getFieldError(fieldName: string): string {
    const field = this.form.get(fieldName);
    if (field && field.errors && field.touched) {
      if (field.errors['required']) {
        return `${this.getFieldLabel(fieldName)} is required`;
      }
      if (field.errors['email']) {
        return 'Please enter a valid email address';
      }
      if (field.errors['minlength']) {
        return `${this.getFieldLabel(fieldName)} must be at least ${field.errors['minlength'].requiredLength} characters`;
      }
      if (field.errors['maxlength']) {
        return `${this.getFieldLabel(fieldName)} must not exceed ${field.errors['maxlength'].requiredLength} characters`;
      }
    }
    return '';
  }

  getFieldLabel(fieldName: string): string {
    const field = this.fields.find(f => f.name === fieldName);
    return field ? field.label : fieldName;
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.form.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  isFieldValid(fieldName: string): boolean {
    const field = this.form.get(fieldName);
    return !!(field && field.valid && field.touched);
  }
}
