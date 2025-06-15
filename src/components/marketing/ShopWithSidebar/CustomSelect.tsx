// src/components/marketing/ShopWithSidebar/CustomSelect.tsx
import React, { useEffect, useRef, useState } from 'react';

export interface Option {
  label: string;
  value: string | number;
}

interface CustomSelectProps {
  options: Option[];
  /** Called whenever the user picks a new option */
  onChange?: (option: Option) => void;
}

const CustomSelect: React.FC<CustomSelectProps> = ({ options, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<Option>(options[0]);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Close dropdown on outside clicks
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const toggle = () => setIsOpen((open) => !open);

  const handleSelect = (opt: Option) => {
    setSelectedOption(opt);
    onChange?.(opt);
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block" ref={containerRef}>
      <button
        type="button"
        className="select-selected px-4 py-2 border rounded cursor-pointer flex items-center justify-between w-48"
        onClick={toggle}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span>{selectedOption.label}</span>
        <span className="ml-2 transform transition-transform" style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}></span>
      </button>

      {isOpen && (
        <ul role="listbox" className="select-items absolute z-10 mt-1 w-48 bg-white border rounded shadow">
          {options.map((opt, idx) => (
            <li
              key={idx}
              role="option"
              aria-selected={opt.value === selectedOption.value}
              className={`px-4 py-2 cursor-pointer hover:bg-gray-100 ${opt.value === selectedOption.value ? 'bg-gray-200' : ''}`}
              onClick={() => handleSelect(opt)}
            >
              {opt.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CustomSelect;
