// LoginGame.jsx
import React, { useState } from 'react';
import {
  DndContext,
  useDraggable,
  useDroppable
} from '@dnd-kit/core';

const bottles = [
  { id: 'whiskey', label: 'Whiskey' },
  { id: 'wine', label: 'Wine' },
  { id: 'beer', label: 'Beer' }
];

const shelves = ['Top Shelf', 'Middle Shelf', 'Bottom Shelf'];

export default function LoginGame() {
  const [shelfMap, setShelfMap] = useState({});

  function handleDragEnd(event) {
    const { active, over } = event;
    if (over) {
      setShelfMap(prev => ({
        ...prev,
        [active.id]: over.id
      }));
    }
  }

  function handleSubmit() {
    // Example: validate puzzle and call /api/auth/login on success
    const correct = shelfMap.whiskey === 'Top Shelf' &&
                    shelfMap.wine === 'Middle Shelf' &&
                    shelfMap.beer === 'Bottom Shelf';
    if (correct) {
      alert('Success! Proceeding to login...');
      // Redirect or unlock login form
    } else {
      alert('Incorrect! Try again.');
    }
  }

  return (
    <div className="p-4">
      <h2 className="text-xl mb-4">Drag Bottles to Correct Shelves</h2>
      <DndContext onDragEnd={handleDragEnd}>
        <div className="flex gap-4 mb-6">
          {bottles.map(bottle => (
            <DraggableBottle key={bottle.id} id={bottle.id} label={bottle.label} />
          ))}
        </div>

        <div className="grid grid-cols-3 gap-4">
          {shelves.map((shelf, index) => (
            <DroppableShelf key={shelf} id={shelf}>
              <p className="text-center font-semibold">{shelf}</p>
              {Object.entries(shelfMap).map(([bottleId, shelfId]) => (
                shelfId === shelf && (
                  <div key={bottleId} className="bg-yellow-200 p-2 mt-2 text-center rounded">
                    {bottleId}
                  </div>
                )
              ))}
            </DroppableShelf>
          ))}
        </div>
      </DndContext>

      <button onClick={handleSubmit} className="mt-6 bg-blue-500 text-white px-4 py-2 rounded">
        Submit Puzzle
      </button>
    </div>
  );
}

function DraggableBottle({ id, label }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={{
        transform: `translate(${transform?.x ?? 0}px, ${transform?.y ?? 0}px)`,
        padding: '8px 16px',
        background: '#d1e7dd',
        borderRadius: '8px',
        cursor: 'grab'
      }}
    >
      {label}
    </div>
  );
}

function DroppableShelf({ id, children }) {
  const { setNodeRef } = useDroppable({ id });
  return (
    <div
      ref={setNodeRef}
      className="border h-32 rounded p-2 bg-gray-50 flex flex-col items-center justify-start"
    >
      {children}
    </div>
  );
}
