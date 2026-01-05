import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown } from 'lucide-react';

const CustomSelect = ({ options, value, onChange, placeholder, error, className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectedRef = useRef(null);

  useEffect(() => {
    if (isOpen && selectedRef.current) {
      setTimeout(() => {
        selectedRef.current.scrollIntoView({ block: 'center', behavior: 'smooth' });
      }, 100);
    }
  }, [isOpen, value]);

  const handleSelect = (optionValue) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  const selectedOption = options.find(opt => opt.value === value);
  const displayLabel = selectedOption ? selectedOption.label : placeholder;

  return (
    <div>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className={`w-full p-2.5 border-2 rounded-xl bg-white text-left flex justify-between items-center transition-colors focus:outline-none ${className} ${error ? 'border-red-500 ring-1 ring-red-500' : 'border-gray-200'}`}
      >
        <span className={value !== undefined && value !== '' && value !== null ? 'text-gray-900 font-medium' : 'text-gray-400'}>
          {displayLabel}
        </span>
        <ChevronDown className="w-4 h-4 text-gray-400" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center" onClick={() => setIsOpen(false)}>
          <div className="absolute inset-0 bg-black/40 animate-fade-in-fast"></div>
          <div 
            className="bg-white w-full max-w-md rounded-t-2xl shadow-lg max-h-[40vh] flex flex-col z-10 animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b text-center font-bold text-gray-700 shrink-0">
              {placeholder}
            </div>
            <div className="overflow-y-auto">
              {options.map(option => {
                const isSelected = option.value === value;
                return (
                  <button
                    key={option.value}
                    ref={isSelected ? selectedRef : null}
                    onClick={() => handleSelect(option.value)}
                    className={`w-full text-center p-3 text-lg transition-colors ${isSelected ? 'bg-emerald-500 text-white font-bold' : 'text-gray-700 hover:bg-gray-50'}`}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomSelect;