import { useState } from 'react';
import {
  Combobox,
  ComboboxButton,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
} from '@headlessui/react';
import { Check, ChevronDown, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ComboboxOptionItem {
  value: string;
  label: string;
}

interface SearchableComboboxProps {
  options: ComboboxOptionItem[];
  value: string;
  onChange: (value: string) => void;
  placeholderLabel?: string;
  disabled?: boolean;
  isLoading?: boolean;
  id?: string;
}

export default function SearchableCombobox({
  options,
  value,
  onChange,
  placeholderLabel = 'Select…',
  disabled = false,
  isLoading = false,
  id,
}: SearchableComboboxProps) {
  const [query, setQuery] = useState('');

  const filtered =
    query === ''
      ? options
      : options.filter((opt) =>
          opt.label.toLowerCase().includes(query.toLowerCase()),
        );

  return (
    <Combobox
      value={value}
      onChange={(val) => {
        onChange(val ?? '');
        setQuery('');
      }}
      disabled={disabled || isLoading}
      immediate
    >
      <div className="relative w-full">
        {/* Input acts as both the trigger and search field */}
        <ComboboxInput
          id={id}
          autoComplete="off"
          className={cn(
            'w-full h-10 rounded-lg border border-gray-200 bg-white pl-3 pr-10 text-sm',
            'focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)]',
            (disabled || isLoading) && 'opacity-50 cursor-not-allowed',
          )}
          displayValue={(val: string) =>
            options.find((o) => o.value === val)?.label ?? ''
          }
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholderLabel}
        />

        {/* Chevron / loader button on the right */}
        <ComboboxButton className="absolute inset-y-0 right-0 flex items-center pr-3">
          {isLoading ? (
            <Loader2 className="h-4 w-4 text-gray-400 animate-spin" />
          ) : (
            <ChevronDown className="h-4 w-4 text-gray-400" />
          )}
        </ComboboxButton>

        {/* Dropdown */}
        <ComboboxOptions
          transition
          className={cn(
            'absolute z-50 mt-1 w-full max-h-60 overflow-y-auto rounded-lg border border-gray-200 bg-white py-1 shadow-lg',
            'transition duration-150 ease-out data-[closed]:opacity-0 data-[closed]:scale-95',
          )}
        >
          {filtered.length === 0 && (
            <p className="px-3 py-2 text-sm text-gray-500">No results</p>
          )}
          {filtered.map((opt) => (
            <ComboboxOption
              key={opt.value}
              value={opt.value}
              className={cn(
                'flex items-center gap-2 cursor-pointer px-3 py-2.5 text-sm text-gray-700',
                'data-[focus]:bg-[var(--color-primary-50)]',
                'data-[selected]:font-medium',
              )}
            >
              {({ selected }) => (
                <>
                  <Check
                    className={cn(
                      'h-4 w-4 shrink-0 text-[var(--color-primary-500)]',
                      selected ? 'opacity-100' : 'opacity-0',
                    )}
                  />
                  <span className="truncate">{opt.label}</span>
                </>
              )}
            </ComboboxOption>
          ))}
        </ComboboxOptions>
      </div>
    </Combobox>
  );
}
