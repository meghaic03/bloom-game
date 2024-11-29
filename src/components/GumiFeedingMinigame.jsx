import React, { useState, useEffect, useRef } from 'react';
import { Button } from "./ui/button";

// Import the necessary images
import emptyFood from './emptyfood.png';
import kibble from './kibble.png';
import chicken from './chicken.png';
import tuna from './tuna.png';
import feedgumiBackground from './feedgumi.png';

const GameContainer = ({ children }) => (
  <div style={{ width: '100vw', height: '100vh', display: 'flex', alignItems: 'center', backgroundColor: '#CCB093' }}>
    <div style={{ width: '960px', margin: '0 auto' }}>
      <div className="h-[540px] relative overflow-hidden">
        {children}
      </div>
    </div>
  </div>
);

const GumiFeedingMinigame = ({ onComplete }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [draggedItem, setDraggedItem] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [bowlContents, setBowlContents] = useState({
    Kibble: false,
    Tuna: false,
    Chicken: false
  });
  const [foodItems] = useState([
    { id: 1, name: 'Kibble', image: kibble },
    { id: 2, name: 'Tuna', image: tuna },
    { id: 3, name: 'Chicken', image: chicken }
  ]);
  const bowlRef = useRef(null);

  const isBowlComplete = () => {
    return Object.values(bowlContents).every(value => value === true);
  };

  const handleDragStart = (e, item) => {
    e.preventDefault();
    setIsDragging(true);
    setDraggedItem(item);
    console.log(`Dragged item position: x=${e.clientX}, y=${e.clientY}`);
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

    const bowl = bowlRef.current;
    const bowlRect = bowl.getBoundingClientRect();

    if (
      e.clientX >= bowlRect.left &&
      e.clientX <= bowlRect.right &&
      e.clientY >= bowlRect.top &&
      e.clientY <= bowlRect.bottom
    ) {
      setBowlContents(prev => {
        const updatedContents = { ...prev, [draggedItem.name]: true };
        if (Object.values(updatedContents).every(value => value === true)) {
          setTimeout(onComplete, 2500);
        }
        return updatedContents;
      });
      console.log(`Dropped item position: x=${e.clientX}, y=${e.clientY}`);
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
  }, [isDragging]);

  return (
    <div className="absolute inset-0 flex items-center justify-center">
      {/* Background Image */}
      <img 
        src={feedgumiBackground} 
        alt="Background" 
        className="absolute inset-0 w-full h-full object-cover"
      />
      
      <div className="relative h-[540px] w-full">
        {/* Food bin */}
        <div className="absolute left-8 top-1/2 -translate-y-1/2 bg-[#8C5751]/20 p-2 rounded-lg border-2 border-[#8C5751] border-dashed">
          {foodItems.map(item => (
            <div
              key={item.id}
              className={`py-1 px-3 mb-1 last:mb-0 bg-[#E4D1B6] text-[#8C5751] rounded cursor-move font-['Cedarville_Cursive'] text-center
                ${isDragging && draggedItem?.id === item.id ? 'opacity-50' : ''}
                ${bowlContents[item.name] ? 'opacity-50 cursor-default' : ''}`}
              onMouseDown={(e) => !bowlContents[item.name] && handleDragStart(e, item)}
            >
              {item.name}
            </div>
          ))}
        </div>

        {/* Bowl */}
        <div
          ref={bowlRef}
          id="cat-bowl"
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48"
        >
          <img src={emptyFood} alt="Empty Food Bowl" className="w-full h-full object-contain" />
          {Object.entries(bowlContents).map(([food, isAdded], index) => (
            isAdded && (
              <img
                key={food}
                src={foodItems.find(item => item.name === food).image}
                alt={food}
                className="w-48 h-48 object-contain absolute"
                style={{
                  top: `${index}%`
                }}
              />
            )
          ))}
        </div>

        {/* Dragged item */}
        {isDragging && draggedItem && (
          <div
            className="fixed pointer-events-none bg-[#E4D1B6] text-[#8C5751] py-1 px-3 rounded font-['Cedarville_Cursive']"
            style={{
              left: mousePos.x - 50,
              top: mousePos.y - 20,
            }}
          >
            {draggedItem.name}
          </div>
        )}

        {/* Text box at bottom */}
        <div className="absolute bottom-4 left-0 right-0 p-4 space-y-2 w-full flex flex-col items-center justify-center">
          <div className="bg-[#E4D1B6]/80 p-3 rounded-xl border-2 border-[#8C5751] border-dashed mx-auto max-w-md w-full">
            <p className="text-sm text-[#8C5751] whitespace-pre-line font-['Cedarville_Cursive']">
              {isBowlComplete() 
                ? "Feed Gumi\n\nGumi looks full!" 
                : "Feed Gumi\n\nGumi needs one scoop of each type of food"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GumiFeedingMinigame;