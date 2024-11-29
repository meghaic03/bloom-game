import React, { useState, useEffect } from 'react';
import { Button } from "./ui/button";

const MedicationMinigame = ({ onComplete }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [draggedItem, setDraggedItem] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [hasPill, setHasPill] = useState(false);
  const [hasWater, setHasWater] = useState(false);
  const [taskComplete, setTaskComplete] = useState(false);

  const handleDragStart = (e, item) => {
    e.preventDefault();
    setIsDragging(true);
    setDraggedItem(item);
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      setMousePos({
        x: e.clientX,
        y: e.clientY
      });
    }
  };

  const handleMouseUp = (e) => {
    if (!isDragging) return;

    const targetArea = document.getElementById('target-area');
    const targetRect = targetArea.getBoundingClientRect();

    if (
      e.clientX >= targetRect.left &&
      e.clientX <= targetRect.right &&
      e.clientY >= targetRect.top &&
      e.clientY <= targetRect.bottom
    ) {
      if (draggedItem === 'pill') {
        setHasPill(true);
      } else if (draggedItem === 'water') {
        setHasWater(true);
      }

      // Check if both tasks are complete
      if ((draggedItem === 'pill' && hasWater) || (draggedItem === 'water' && hasPill)) {
        setTaskComplete(true);
        setTimeout(() => {
          onComplete();
        }, 2500);
      }
    }

    setIsDragging(false);
    setDraggedItem(null);
  };

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, hasPill, hasWater, taskComplete]);

  return (
    <div className="absolute inset-0 flex items-center justify-center" style={{
      backgroundImage: "url('/src/assets/medication-bg.png')",
      backgroundSize: "cover",
      backgroundPosition: "center"
    }}>
      <div className="relative h-[540px] w-full">
        {/* Target Area - now doubled in height */}
        <div 
          id="target-area"
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-64 w-32 flex items-center justify-center"
        >
          {taskComplete ? (
            <div className="flex items-center justify-center gap-4">
              <img src="/src/assets/pills.png" alt="Pill" className="w-12 h-12 opacity-0" />
              <img src="/src/assets/emptywater.png" alt="Water" className="w-12 h-12 object-contain opacity-100" />
            </div>
          ) : (
            <>
              {hasPill && (
                <img src="/src/assets/pills.png" alt="Pill" className="w-12 h-12 transition-opacity duration-300" style={{ opacity: hasPill ? 0 : 1 }} />
              )}
              {hasWater && (
                <img src="/src/assets/emptywater.png" alt="Water" className="w-12 h-12 object-contain transition-opacity duration-300" style={{ opacity: hasWater ? 0 : 1 }} />
              )}
            </>
          )}
        </div>

        {/* Items to drag - now on the right */}
        <div className="absolute right-8 top-1/2 -translate-y-1/2 space-y-4">
          {/* Pill Box */}
          {!hasPill && (
            <div 
              className="bg-[#8C5751]/20 p-4 rounded-lg border-2 border-[#8C5751] border-dashed cursor-move flex items-center justify-center"
              onMouseDown={(e) => handleDragStart(e, 'pill')}
            >
              <img src="/src/assets/pills.png" alt="Pill" className="w-12 h-12" />
            </div>
          )}
          
          {/* Water */}
          {!hasWater && (
            <div 
              className="bg-[#8C5751]/20 p-4 rounded-lg border-2 border-[#8C5751] border-dashed cursor-move flex items-center justify-center"
              onMouseDown={(e) => handleDragStart(e, 'water')}
            >
              <img src="/src/assets/fullwater.png" alt="Water" className="w-12 h-12 object-contain" />
            </div>
          )}
        </div>

        {/* Dragged Item */}
        {isDragging && draggedItem && (
          <div
            className="fixed pointer-events-none"
            style={{
              left: mousePos.x - 12,
              top: mousePos.y - 12
            }}
          >
            {draggedItem === 'pill' ? (
              <img src="/src/assets/pills.png" alt="Pill" className="w-12 h-12" />
            ) : (
              <img src="/src/assets/fullwater.png" alt="Water" className="w-12 h-12 object-contain" />
            )}
          </div>
        )}

        {/* Text box at bottom */}
        <div className="absolute bottom-4 left-0 right-0 p-4 space-y-2 w-full flex flex-col items-center justify-center">
          <div className="bg-[#E4D1B6]/80 p-3 rounded-xl border-2 border-[#8C5751] border-dashed mx-auto max-w-md w-full">
            <p className="text-sm text-[#8C5751] whitespace-pre-line font-['Cedarville_Cursive']">
              {taskComplete 
                ? "Take Medication\n\nAll done!" 
                : "Take Medication\n\nDrag the pill and water to take your medication."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicationMinigame;