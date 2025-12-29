
import React, { useState, useRef, useEffect } from 'react';

interface ComparisonSliderProps {
  before: string;
  after: string;
  labelBefore?: string;
  labelAfter?: string;
}

const ComparisonSlider: React.FC<ComparisonSliderProps> = ({ 
  before, 
  after, 
  labelBefore = "Original", 
  labelAfter = "AI Enhanced" 
}) => {
  const [sliderPos, setSliderPos] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const position = ((x - rect.left) / rect.width) * 100;
    setSliderPos(Math.max(0, Math.min(100, position)));
  };

  return (
    <div 
      ref={containerRef}
      className="relative w-full aspect-square bg-gray-900 rounded-2xl overflow-hidden cursor-col-resize select-none border border-gray-100 dark:border-gray-800"
      onMouseMove={(e) => e.buttons === 1 && handleMove(e)}
      onTouchMove={handleMove}
      onMouseDown={handleMove}
    >
      {/* After Image (Background) */}
      <img src={after} alt="After" className="absolute inset-0 w-full h-full object-contain" />
      
      {/* Before Image (Foreground Clip) */}
      <div 
        className="absolute inset-0 w-full h-full overflow-hidden"
        style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
      >
        <img src={before} alt="Before" className="absolute inset-0 w-full h-full object-contain" />
      </div>

      {/* Slider Line */}
      <div 
        className="absolute inset-y-0 w-1 bg-white shadow-xl flex items-center justify-center z-10"
        style={{ left: `${sliderPos}%` }}
      >
        <div className="w-8 h-8 rounded-full bg-white shadow-lg flex items-center justify-center -ml-0.5">
          <svg className="w-4 h-4 text-gray-400 rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M8 7l4-4m0 0l4 4m-4-4v18" />
          </svg>
        </div>
      </div>

      {/* Labels */}
      <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur px-2 py-1 rounded text-[10px] text-white font-bold uppercase pointer-events-none">
        {labelBefore}
      </div>
      <div className="absolute bottom-4 right-4 bg-indigo-600/80 backdrop-blur px-2 py-1 rounded text-[10px] text-white font-bold uppercase pointer-events-none">
        {labelAfter}
      </div>
    </div>
  );
};

export default ComparisonSlider;
