import { useEffect } from 'react';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.css';
import Label from './Label';
import { CalenderIcon } from '../../icons';
import Hook = flatpickr.Options.Hook;
import DateOption = flatpickr.Options.DateOption;

type PropsType = {
  id: string;
  mode?: "single" | "multiple" | "range" | "time";
  onChange?: (dates: Date[]) => void;
  value: Date[];
  defaultDate?: DateOption;
  label?: string;
  placeholder?: string;
};

export default function DatePicker({
  id,
  mode,
  onChange,
  label,
  value,
  defaultDate,
  placeholder,
}: PropsType) {
  useEffect(() => {
    // Initialize flatpickr instance
    const flatPickrInstance = flatpickr(`#${id}`, {
      mode: mode || "single",
      static: true,
      monthSelectorType: "static",
      dateFormat: "Y-m-d",
      defaultDate,
      onChange: (selectedDates: Date[]) => {
        if (onChange) {
          onChange(selectedDates); // Pass selected dates to onChange
        }
      },
    });

    // Cleanup function to destroy flatpickr instance on unmount or dependency change
    return () => {
      if (Array.isArray(flatPickrInstance)) {
        flatPickrInstance.forEach((instance) => instance.destroy()); // Destroy each instance in the array
      } else {
        flatPickrInstance.destroy(); // Destroy single instance
      }
    };
  }, [mode, onChange, id, defaultDate]);

  return (
    <div>
      {label && <Label htmlFor={id}>{label}</Label>}

      <div className="relative">
        <input
          id={id}
          placeholder={placeholder}
          className="h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700 dark:focus:border-brand-800"
          value={value.length > 0 ? value[0].toLocaleDateString('en-CA').split('T')[0] : ''} // Display the first date in the array
          readOnly // Make the input readonly as flatpickr handles it
        />

        <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none left-3 top-1/2 dark:text-gray-400">
          <CalenderIcon className="size-6" />
        </span>
      </div>
    </div>
  );
}
