import React, { useState, useRef, useEffect } from 'react';

const ImageCompareSlider = ({ originalImageUrl, modifiedImageUrl }) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const sliderRef = useRef(null);

  const handleMouseMove = (e) => {
    if (sliderRef.current) {
      const rect = sliderRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      let position = (x / rect.width) * 100;
      if (position < 0) position = 0;
      if (position > 100) position = 100;
      setSliderPosition(position);
    }
  };

  const handleTouchMove = (e) => {
    if (sliderRef.current && e.touches.length > 0) {
      const rect = sliderRef.current.getBoundingClientRect();
      const x = e.touches[0].clientX - rect.left;
      let position = (x / rect.width) * 100;
      if (position < 0) position = 0;
      if (position > 100) position = 100;
      setSliderPosition(position);
    }
  };

  useEffect(() => {
    const slider = sliderRef.current;
    if (slider) {
      slider.addEventListener('mousemove', handleMouseMove);
      slider.addEventListener('touchmove', handleTouchMove);

      return () => {
        slider.removeEventListener('mousemove', handleMouseMove);
        slider.removeEventListener('touchmove', handleTouchMove);
      };
    }
  }, [originalImageUrl, modifiedImageUrl]);

  return (
    <div
      ref={sliderRef}
      className="relative w-full max-w-2xl aspect-video overflow-hidden rounded-lg shadow-lg cursor-ew-resize group"
      onMouseLeave={() => setSliderPosition(50)} // Reset on mouse leave
      onTouchEnd={() => setSliderPosition(50)} // Reset on touch end
    >
      <img
        src={modifiedImageUrl}
        alt="Compressed"
        className="absolute inset-0 w-full h-full object-contain"
      />
      <div className="absolute top-4 right-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-md text-sm font-semibold">
        Compressed
      </div>
      <div
        className="absolute inset-0 w-full h-full overflow-hidden"
        style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
      >
        <img
          src={originalImageUrl}
          alt="Original"
          className="absolute inset-0 w-full h-full object-contain"
        />
      </div>
      <div className="absolute top-4 left-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-md text-sm font-semibold">
        Original
      </div>
      <div
        className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize z-10 transform -translate-x-1/2 group-hover:bg-blue-500 transition-colors duration-200"
        style={{ left: `${sliderPosition}%` }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center group-hover:bg-blue-500 transition-colors duration-200">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-gray-600 group-hover:text-white transition-colors duration-200"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 102 0V8a1 1 0 00-.445-.832l-1-.5A1 1 0 009 6V5a1 1 0 10-2 0v1a1 1 0 00.445.832l1 .5z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default ImageCompareSlider;