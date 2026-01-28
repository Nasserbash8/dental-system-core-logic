import React, { useState } from "react";

interface Option {
  id: string;  
  value: string;
  text: string;
  selected: boolean;
}

interface MultiSelectProps {
  label: string;
  options: Option[];
  defaultSelected?: string[];
  onChange?: (selected: { id: string; value: string }[]) => void;
  disabled?: boolean;
}

const MultiSelect: React.FC<MultiSelectProps> = ({
  label,
  options,
  defaultSelected = [],
  onChange,
  disabled = false,
}) => {
  const [selectedOptions, setSelectedOptions] = useState<string[]>(
    defaultSelected
  );
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    if (disabled) return;
    setIsOpen((prev) => !prev);
  };

  const handleSelect = (optionValue: string) => {
  const newSelectedOptions = selectedOptions.includes(optionValue)
    ? selectedOptions.filter((value) => value !== optionValue)
    : [...selectedOptions, optionValue];

  setSelectedOptions(newSelectedOptions);

  if (onChange) {
    const selected = options
      .filter((opt) => newSelectedOptions.includes(opt.value))
      .map((opt) => ({ id: opt.id, value: opt.value }));

    onChange(selected);
  }
};


const removeOption = (index: number, value: string) => {
  const newSelectedOptions = selectedOptions.filter((opt) => opt !== value);
  setSelectedOptions(newSelectedOptions);

  if (onChange) {
    const selected = options
      .filter((opt) => newSelectedOptions.includes(opt.value))
      .map((opt) => ({ id: opt.id, value: opt.value }));

    onChange(selected);
  }
};


  const selectedValuesText = selectedOptions.map(
    (value) => options.find((option) => option.value === value)?.text || ""
  );

  return (
    <div className="w-full text-sm">
      <label className="mb-2 block font-medium text-gray-700 dark:text-gray-300">
        {label}
      </label>

      <div className="relative">
        <div
          onClick={toggleDropdown}
          className={`flex min-h-[44px] flex-wrap items-center rounded-lg border px-3 py-2 ${
            disabled
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "cursor-pointer border-gray-300 hover:border-gray-400 dark:border-gray-600 dark:hover:border-gray-400"
          }`}
        >
          {selectedValuesText.length > 0 ? (
            selectedValuesText.map((text, index) => (
              <div
                key={index}
                className="mr-2 mb-1 flex items-center rounded-full bg-gray-200 px-2 py-1 text-xs text-gray-700 dark:bg-gray-700 dark:text-white"
              >
                {text}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeOption(index, selectedOptions[index]);
                  }}
                  className="ml-2 text-gray-500 hover:text-gray-700 dark:hover:text-white"
                >
                  ✕
                </button>
              </div>
            ))
          ) : (
            <span className="text-gray-400 dark:text-gray-500">اختار</span>
          )}

          <div className="ml-auto">
            <svg
              className={`h-5 w-5 transform transition-transform ${
                isOpen ? "rotate-180" : ""
              }`}
              viewBox="0 0 20 20"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path d="M6 8l4 4 4-4" />
            </svg>
          </div>
        </div>

        {isOpen && (
          <div
            className="absolute mt-1 max-h-64 w-full overflow-auto rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800 z-50"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="grid grid-cols-2   gap-2 p-3">
              {options.map((option) => {
                const isChecked = selectedOptions.includes(option.value);
                return (
                  <label
                    key={option.value}
                    className="flex items-center space-x-2 rounded-md border border-gray-200 p-2 text-gray-800 hover:bg-gray-100 dark:border-gray-700 dark:text-white dark:hover:bg-gray-700 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => handleSelect(option.value)}
                      className="accent-brand-600"
                    />
                    <span className="text-sm">{option.text}</span>
                  </label>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MultiSelect;
