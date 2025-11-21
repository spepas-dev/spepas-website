import React from 'react';

export type Option = { label: string; value: string };

export type CustomSelectProps = {
  options: Option[];
  /** Controlled value (preferred). */
  value?: string;
  /** Uncontrolled initial value (fallback when value is undefined). */
  defaultValue?: string;
  /** Callback with the *string* value. */
  onChange?: (value: string) => void;
  className?: string;
  selectProps?: React.SelectHTMLAttributes<HTMLSelectElement>;
};

const base =
  'h-10 rounded-lg border border-gray-300 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500';

const CustomSelect: React.FC<CustomSelectProps> = ({
  options,
  value,
  defaultValue,
  onChange,
  className = '',
  selectProps,
}) => {
  const [internal, setInternal] = React.useState<string>(
    defaultValue ?? options[0]?.value ?? ''
  );

  // Use controlled value if provided; otherwise internal
  const current = value ?? internal;

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const v = e.target.value;
    if (onChange) onChange(v);
    // only update internal when uncontrolled
    if (value === undefined) setInternal(v);
  };

  return (
    <select
      value={current}
      onChange={handleChange}
      className={`${base} ${className}`}
      {...selectProps}
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
};

export default CustomSelect;
