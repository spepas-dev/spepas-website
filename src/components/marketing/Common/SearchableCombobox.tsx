import { Combobox, ComboboxButton, ComboboxInput, ComboboxOption, ComboboxOptions } from '@headlessui/react';
import { Check, ChevronDown, Loader2 } from 'lucide-react';
import { useState } from 'react';

import { cn } from '@/lib/utils';

export interface ComboboxOptionItem {
  value: string;
  label: string;
  count?: number;
}

interface SearchableComboboxProps {
  options: ComboboxOptionItem[];
  value: string;
  onChange: (value: string) => void;
  placeholderLabel?: string;
  disabled?: boolean;
  isLoading?: boolean;
  id?: string;
  /** Compact mode — chip-height input for inline filter rows */
  compact?: boolean;
}

export default function SearchableCombobox({
  options,
  value,
  onChange,
  placeholderLabel = 'Select…',
  disabled = false,
  isLoading = false,
  id,
  compact = false
}: SearchableComboboxProps) {
  const [query, setQuery] = useState('');

  const filtered = query === '' ? options : options.filter((opt) => opt.label.toLowerCase().includes(query.toLowerCase()));

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
      <div className={cn('relative', compact ? 'w-44' : 'w-full')}>
        {/* Input acts as both the trigger and search field */}
        <ComboboxInput
          id={id}
          autoComplete="off"
          className={cn(
            'w-full rounded-lg border bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)]',
            compact
              ? 'h-[26px] rounded-full border-gray-200 bg-gray-100 pl-2.5 pr-7 text-xs font-medium text-gray-600 placeholder:text-gray-400'
              : 'h-10 border-gray-200 pl-3 pr-10 text-sm',
            (disabled || isLoading) && 'opacity-50 cursor-not-allowed'
          )}
          displayValue={(val: string) => options.find((o) => o.value === val)?.label ?? ''}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholderLabel}
        />

        {/* Chevron / loader button on the right */}
        <ComboboxButton className={cn('absolute inset-y-0 right-0 flex items-center', compact ? 'pr-1.5' : 'pr-3')}>
          {isLoading ? (
            <Loader2 className={cn('text-gray-400 animate-spin', compact ? 'h-3 w-3' : 'h-4 w-4')} />
          ) : (
            <ChevronDown className={cn('text-gray-400', compact ? 'h-3 w-3' : 'h-4 w-4')} />
          )}
        </ComboboxButton>

        {/* Dropdown */}
        <ComboboxOptions
          transition
          className={cn(
            'absolute z-50 mt-1 max-h-60 overflow-y-auto rounded-lg border border-gray-200 bg-white py-1 shadow-lg',
            'transition duration-150 ease-out data-[closed]:opacity-0 data-[closed]:scale-95',
            compact ? 'w-64 right-0' : 'w-full'
          )}
        >
          {filtered.length === 0 && <p className={cn('px-3 text-gray-500', compact ? 'py-1.5 text-xs' : 'py-2 text-sm')}>No results</p>}
          {filtered.map((opt) => (
            <ComboboxOption
              key={opt.value}
              value={opt.value}
              className={cn(
                'flex items-center gap-2 cursor-pointer text-gray-700',
                'data-[focus]:bg-[var(--color-primary-50)]',
                'data-[selected]:font-medium',
                compact ? 'px-2.5 py-1.5 text-xs' : 'px-3 py-2.5 text-sm'
              )}
            >
              {({ selected }) => (
                <>
                  <Check
                    className={cn(
                      'shrink-0 text-[var(--color-primary-500)]',
                      selected ? 'opacity-100' : 'opacity-0',
                      compact ? 'h-3 w-3' : 'h-4 w-4'
                    )}
                  />
                  <span className="truncate">{opt.label}</span>
                  {opt.count != null && (
                    <span
                      className={cn(
                        'ml-auto shrink-0 rounded-full bg-gray-100 text-gray-500 font-medium tabular-nums',
                        compact ? 'px-1.5 text-[10px]' : 'px-2 py-0.5 text-[11px]'
                      )}
                    >
                      {opt.count}
                    </span>
                  )}
                </>
              )}
            </ComboboxOption>
          ))}
        </ComboboxOptions>
      </div>
    </Combobox>
  );
}
