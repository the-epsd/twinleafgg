import { useEffect, useMemo, useState } from 'react';
import { cn } from '../../utils/cn';
import { TwinleafButton } from './TwinleafButton';
import styles from './TwinleafForm.module.css';
import type { TwinleafFormField, TwinleafFormStyle, TwinleafFormValues } from './twinleafFormTypes';

export type TwinleafFormProps = {
  fields: TwinleafFormField[];
  submitText?: string;
  loading?: boolean;
  disabled?: boolean;
  showValidation?: boolean;
  formStyle?: TwinleafFormStyle;
  className?: string;
  onSubmit?: (values: TwinleafFormValues) => void;
  onChange?: (values: TwinleafFormValues) => void;
};

function initialValues(fields: TwinleafFormField[]): TwinleafFormValues {
  const next: TwinleafFormValues = {};
  for (const field of fields) {
    if (field.value !== undefined) {
      next[field.name] = field.value;
    } else if (field.type === 'checkbox') {
      next[field.name] = false;
    } else {
      next[field.name] = '';
    }
  }
  return next;
}

function validateField(field: TwinleafFormField, raw: string | boolean | number): string {
  if (field.type === 'checkbox') {
    return '';
  }
  const value = String(raw ?? '');
  if (field.required && value.trim() === '') {
    return `${field.label} is required`;
  }
  if (field.minLength != null && value.length < field.minLength) {
    return `${field.label} must be at least ${field.minLength} characters`;
  }
  if (field.type === 'email' && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
    return 'Please enter a valid email address';
  }
  if (field.pattern && value && !field.pattern.test(value)) {
    return `${field.label} is invalid`;
  }
  return '';
}

function ValidIcon() {
  return (
    <svg className={`${styles.statusIcon} ${styles.statusValid}`} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
    </svg>
  );
}

function InvalidIcon() {
  return (
    <svg className={`${styles.statusIcon} ${styles.statusInvalid}`} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
    </svg>
  );
}

export function TwinleafForm({
  fields,
  submitText = 'Submit',
  loading = false,
  disabled = false,
  showValidation = true,
  formStyle = 'default',
  className,
  onSubmit,
  onChange,
}: TwinleafFormProps) {
  const [values, setValues] = useState<TwinleafFormValues>(() => initialValues(fields));
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    setValues(initialValues(fields));
    setSubmitted(false);
    setErrors({});
  }, [fields]);

  useEffect(() => {
    onChange?.(values);
  }, [values, onChange]);

  const formClass = useMemo(
    () =>
      cn(
        styles.form,
        formStyle === 'futuristic' && styles.futuristic,
        formStyle === 'minimal' && styles.minimal,
        className,
      ),
    [formStyle, className],
  );

  function setFieldValue(name: string, value: string | boolean | number) {
    setValues((prev) => ({ ...prev, [name]: value }));
  }

  function validateAll(): Record<string, string> {
    const next: Record<string, string> = {};
    for (const field of fields) {
      const message = validateField(field, values[field.name] ?? '');
      if (message) {
        next[field.name] = message;
      }
    }
    return next;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
    const nextErrors = validateAll();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length === 0 && !loading && !disabled) {
      onSubmit?.(values);
    }
  }

  function isValid(name: string): boolean {
    return submitted && !errors[name] && String(values[name] ?? '') !== '';
  }

  function isInvalid(name: string): boolean {
    return submitted && Boolean(errors[name]);
  }

  return (
    <form className={formClass} onSubmit={handleSubmit} noValidate>
      <div className={styles.fields}>
        {fields.map((field) => {
          if (field.type === 'checkbox') {
            return (
              <div key={field.name} className={styles.field}>
                <label className={styles.checkboxLabel} htmlFor={field.name}>
                  <input
                    id={field.name}
                    type="checkbox"
                    className={styles.checkboxInput}
                    checked={Boolean(values[field.name])}
                    onChange={(e) => setFieldValue(field.name, e.target.checked)}
                  />
                  <span className={styles.checkmark} />
                  {field.label}
                </label>
                {showValidation && isInvalid(field.name) ? (
                  <div className={styles.error}>{errors[field.name]}</div>
                ) : null}
              </div>
            );
          }

          if (field.type === 'select') {
            return (
              <div key={field.name} className={styles.field}>
                <label className={styles.label} htmlFor={field.name}>
                  {field.label}
                </label>
                <select
                  id={field.name}
                  className={styles.select}
                  value={String(values[field.name] ?? '')}
                  onChange={(e) => setFieldValue(field.name, e.target.value)}
                >
                  <option value="" disabled>
                    {field.placeholder ?? 'Select an option'}
                  </option>
                  {field.options?.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                {showValidation && isInvalid(field.name) ? (
                  <div className={styles.error}>{errors[field.name]}</div>
                ) : null}
              </div>
            );
          }

          return (
            <div key={field.name} className={styles.field}>
              <label className={styles.label} htmlFor={field.name}>
                {field.label}
              </label>
              <div className={styles.inputWrapper}>
                <input
                  id={field.name}
                  type={field.type}
                  className={cn(
                    styles.input,
                    isValid(field.name) && styles.inputValid,
                    isInvalid(field.name) && styles.inputInvalid,
                  )}
                  placeholder={field.placeholder ?? ' '}
                  value={String(values[field.name] ?? '')}
                  onChange={(e) => setFieldValue(field.name, e.target.value)}
                />
                {formStyle === 'futuristic' ? <div className={styles.glow} aria-hidden /> : null}
                {formStyle === 'futuristic' && submitted ? (
                  <div className={styles.status}>
                    {isValid(field.name) ? <ValidIcon /> : null}
                    {isInvalid(field.name) ? <InvalidIcon /> : null}
                  </div>
                ) : null}
              </div>
              {field.hint ? <div className={styles.hint}>{field.hint}</div> : null}
              {showValidation && isInvalid(field.name) ? (
                <div className={styles.error}>{errors[field.name]}</div>
              ) : null}
            </div>
          );
        })}
      </div>
      <div className={styles.actions}>
        <TwinleafButton
          text={submitText}
          loading={loading}
          disabled={disabled}
          fullWidth
          type="submit"
        />
      </div>
    </form>
  );
}
