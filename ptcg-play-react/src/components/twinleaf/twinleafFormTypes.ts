export type TwinleafFormFieldType = 'text' | 'password' | 'email' | 'number' | 'checkbox' | 'select';

export interface TwinleafFormFieldOption {
  value: string;
  label: string;
}

export interface TwinleafFormField {
  name: string;
  label: string;
  type: TwinleafFormFieldType;
  placeholder?: string;
  required?: boolean;
  minLength?: number;
  pattern?: RegExp;
  options?: TwinleafFormFieldOption[];
  hint?: string;
  value?: string | boolean | number;
}

export type TwinleafFormStyle = 'default' | 'futuristic' | 'minimal';

export type TwinleafFormValues = Record<string, string | boolean | number>;
