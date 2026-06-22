import './FormField.scss';

interface FormFieldProps {
  label: string;
  htmlFor: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}

export default function FormField({
  label,
  htmlFor,
  error,
  required = false,
  children,
}: FormFieldProps) {
  return (
    <div className="formField">
      <label htmlFor={htmlFor}>
        {label}
        {required && <span className="required">*</span>}
      </label>
      {children}
      {error && (
        <span className="errorMessage" role="alert">
          {error}
        </span>
      )}
    </div>
  );
}
