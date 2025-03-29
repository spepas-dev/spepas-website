import { useEffect, useState } from 'react';

const CustomSelect = ({ options }: { options: { label: string; value: string }[] }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(options[0]);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionClick = (option: { label: string; value: string }) => {
    setSelectedOption(option);
    toggleDropdown();
  };

  useEffect(() => {
    // closing modal while clicking outside
    function handleClickOutside(event: MouseEvent) {
      if (event.target && 'closest' in event.target && !(event.target as Element).closest('.dropdown-content')) {
        toggleDropdown();
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="dropdown-content custom-select relative" style={{ width: '200px' }}>
      <div className={`select-selected whitespace-nowrap ${isOpen ? 'select-arrow-active' : ''}`} onClick={toggleDropdown}>
        {selectedOption.label}
      </div>
      <div className={`select-items ${isOpen ? '' : 'select-hide'}`}>
        {options.slice(1, -1).map((option, index) => (
          <div
            key={index}
            onClick={() => handleOptionClick(option)}
            className={`select-item ${selectedOption === option ? 'same-as-selected' : ''}`}
          >
            {option.label}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomSelect;
