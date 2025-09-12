import React from 'react';

interface SliderProps {
  value?: number[];
  onValueChange?: (value: number[]) => void;
  max?: number;
  min?: number;
  step?: number;
  className?: string;
}

const Slider: React.FC<SliderProps> = ({ 
  value = [0], 
  onValueChange, 
  max = 100, 
  min = 0, 
  step = 1, 
  className = '' 
}) => {
  return (
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value[0]}
      onChange={(e) => onValueChange?.([parseInt(e.target.value)])}
      className={`w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer ${className}`}
    />
  );
};

export { Slider };