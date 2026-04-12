import React, { useRef, useState, useEffect } from 'react';
import './RatingSlider.css';

const STEPS = [
  { value: 'Any', label: 'Any' },
  { value: '2.0', label: '2.0+' },
  { value: '3.0', label: '3.0+' },
  { value: '4.0', label: '4.0+' }
];

const RatingSlider = ({ value, onChange }) => {
  const currentIndex = STEPS.findIndex(s => s.value === value) > -1 ? STEPS.findIndex(s => s.value === value) : 0;
  const trackRef = useRef(null);
  
  const handleStepClick = (index) => {
    onChange(STEPS[index].value);
  };

  const handlePointerDown = (e) => {
    e.target.setPointerCapture(e.pointerId);
    handleMove(e);
  };

  const handlePointerMove = (e) => {
    if (e.buttons === 1) { // Left mouse button / touch drag
      handleMove(e);
    }
  };

  const handleMove = (e) => {
    if (!trackRef.current) return;
    const rect = trackRef.current.getBoundingClientRect();
    let percent = (e.clientX - rect.left) / rect.width;
    percent = Math.max(0, Math.min(1, percent));
    const rawIndex = percent * (STEPS.length - 1);
    const closestIndex = Math.round(rawIndex);
    if (STEPS[closestIndex].value !== value) {
      onChange(STEPS[closestIndex].value);
    }
  };

  return (
    <div className="rating-slider-container">
      <div 
        className="slider-track-wrapper" 
        ref={trackRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        style={{ touchAction: 'none' }}
      >
        <div className="slider-track-bg"></div>
        <div 
          className="slider-track-fill" 
          style={{ width: `${(currentIndex / (STEPS.length - 1)) * 100}%` }}
        ></div>
        {STEPS.map((step, index) => (
          <div 
            key={step.value}
            className="slider-stop-zone"
            style={{ left: `${(index / (STEPS.length - 1)) * 100}%` }}
            onClick={(e) => { e.stopPropagation(); handleStepClick(index); }}
          >
            {currentIndex === index && <div className="slider-thumb" />}
          </div>
        ))}
      </div>
      <div className="slider-labels">
        {STEPS.map((step, index) => (
          <span 
            key={step.value} 
            className={`slider-label ${currentIndex === index ? 'active' : ''}`}
            onClick={() => handleStepClick(index)}
          >
            {step.label}
          </span>
        ))}
      </div>
    </div>
  );
};

export default RatingSlider;
