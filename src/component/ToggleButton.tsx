"use client";

import { useState, useEffect } from "react";

interface ToggleButtonProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
}

export const ToggleButton: React.FC<ToggleButtonProps> = ({
  checked = false,
  onChange,
}) => {
  const [isChecked, setIsChecked] = useState(checked);

  useEffect(() => {
    setIsChecked(checked);
  }, [checked]);

  const handleToggle = () => {
    const newChecked = !isChecked;
    setIsChecked(newChecked);
    // onChange && onChange(newChecked);
  };

  return (
    <label className="relative inline-flex h-6 w-11 cursor-pointer items-center">
      <input
        type="checkbox"
        checked={isChecked}
        onChange={handleToggle}
        className="sr-only"
      />
      <div
        className={`block h-6 w-11 rounded-full transition-colors duration-200 ${
          isChecked ? "bg-green-700" : "bg-gray-300"
        }`}
      ></div>
      <span
        className={`dot absolute left-1 top-1 size-4 rounded-full bg-white transition-transform duration-200 ${
          isChecked ? "translate-x-5" : "translate-x-0"
        }`}
      ></span>
    </label>
  );
};

export default ToggleButton;
