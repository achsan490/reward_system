import { useEffect, useRef } from 'react';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.css';
import Label from './Label';
import { CalenderIcon } from '../../icons';
import Hook = flatpickr.Options.Hook;
import DateOption = flatpickr.Options.DateOption;

type PropsType = {
  id: string;
  mode?: "single" | "multiple" | "range" | "time";
  onChange?: Hook | Hook[];
  defaultDate?: DateOption;
  label?: string;
  placeholder?: string;
};

export default function DatePicker({
  id,
  mode,
  onChange,
  label,
  defaultDate,
  placeholder,
}: PropsType) {
  const inputRef = useRef<HTMLInputElement>(null);
  const flatpickrInstanceRef = useRef<flatpickr.Instance | null>(null);
  const onChangeRef = useRef(onChange);

  // Update ref when onChange prop changes
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  // Initialize Flatpickr (Run once)
  useEffect(() => {
    if (!inputRef.current) return;

    const calendar = flatpickr(inputRef.current, {
      mode: mode || "single",
      static: true,
      monthSelectorType: "static",
      dateFormat: "Y-m-d",
      altInput: true,
      altFormat: "d/m/Y",
      defaultDate: defaultDate,
      onChange: (...args) => {
        const handler = onChangeRef.current;
        if (Array.isArray(handler)) {
          handler.forEach((h) => h(...args));
        } else if (typeof handler === "function") {
          handler(...args);
        }
      },
      // Prevent flatpickr from opening native mobile datepicker on strict inputs
      disableMobile: true,
    });

    flatpickrInstanceRef.current = calendar as flatpickr.Instance;

    return () => {
      // Safely destroy
      if (flatpickrInstanceRef.current) {
        flatpickrInstanceRef.current.destroy();
        flatpickrInstanceRef.current = null;
      }
    };
  }, [mode]); // Intentionally removed defaultsDate and onChange to prevent re-init. Removed ID as we use ref.

  // Watch for external date changes (Sync prop -> internal state)
  useEffect(() => {
    if (flatpickrInstanceRef.current && defaultDate) {
      // Only update if the date is actually different to avoid loop
      flatpickrInstanceRef.current.setDate(defaultDate, false); // false = do not trigger onChange
    }
  }, [defaultDate]);

  return (
    <div>
      {label && <Label htmlFor={id}>{label}</Label>}

      <div className="relative">
        <input
          ref={inputRef}
          id={id}
          type="hidden"
          placeholder={placeholder}
          className="h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 cursor-pointer dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700 dark:focus:border-brand-800"
        />

        <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
          <CalenderIcon className="size-6" />
        </span>
      </div>
    </div>
  );
}
