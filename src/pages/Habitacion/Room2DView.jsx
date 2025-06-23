// src/components/Room2DView.jsx

import React, { useState, useEffect } from 'react';

/**
 * Room2DView dibuja una representación sencilla de una habitación en SVG.
 * 
 * Props:
 *  - room: objeto con las dimensiones de la habitación (ancho, largo)
 *  - furniture: array de objetos con las dimensiones y tipo de muebles
 *  - setFurniture: función para actualizar el array de muebles
 *  - selectedId: identificador del mueble seleccionado
 *  - setSelectedId: función para actualizar el identificador del mueble seleccionado
 *  - scale (opcional): escala en pixeles/metro (por defecto 80 px por metro)
 *
 * Este componente asume:
 *  - La puerta será dibujada (si existe) en la pared inferior, centrada, con ancho 0.8 m y grosor de 0.1 m.
 *  - Las ventanas (si existen 2) se dibujan: una centro de la pared izquierda y otra centro de la pared derecha, cada ventana de ancho 1 m y grosor 0.1 m.
 */

// Utilidades de validación
function isOverlapping(a, b) {
  return !(
    a.x + a.width <= b.x ||
    a.x >= b.x + b.width ||
    a.y + a.height <= b.y ||
    a.y >= b.y + b.height
  );
}

function isWithinRoom(f, roomWidth, roomHeight) {
  return (
    f.x >= 0 &&
    f.y >= 0 &&
    f.x + f.width <= roomWidth &&
    f.y + f.height <= roomHeight
  );
}

export default function Room2DView({
  room = { ancho: 5, largo: 4 }, // metros
  furniture = [],
  setFurniture,
  selectedId,
  setSelectedId,
  scale = 80 // px/metro
}) {
  const widthPx = room.ancho * scale;
  const heightPx = room.largo * scale;
  const padding = 20;
  const svgWidth = widthPx + padding * 2;
  const svgHeight = heightPx + padding * 2;

  // Drag state
  const [draggingId, setDraggingId] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  // Eliminar mueble con Delete
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Delete' && selectedId) {
        setFurniture(furniture.filter(f => f.id !== selectedId));
        setSelectedId(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedId, furniture, setFurniture, setSelectedId]);

  // Drag handlers
  function onMouseDown(e, f) {
    setDraggingId(f.id);
    // Calcula offset entre mouse y esquina del mueble
    const svgRect = e.target.ownerSVGElement.getBoundingClientRect();
    const mouseX = e.clientX - svgRect.left - padding;
    const mouseY = e.clientY - svgRect.top - padding;
    setDragOffset({ x: mouseX - f.x * scale, y: mouseY - f.y * scale });
  }

  function onMouseMove(e) {
    if (!draggingId) return;
    const svg = document.getElementById('room2d-svg');
    const svgRect = svg.getBoundingClientRect();
    const mouseX = e.clientX - svgRect.left - padding;
    const mouseY = e.clientY - svgRect.top - padding;
    // Nueva posición en metros
    let newX = (mouseX - dragOffset.x) / scale;
    let newY = (mouseY - dragOffset.y) / scale;
    // Encuentra el mueble
    const idx = furniture.findIndex(f => f.id === draggingId);
    if (idx === -1) return;
    const moving = { ...furniture[idx], x: newX, y: newY };
    // Validación
    const others = furniture.filter(f => f.id !== moving.id);
    const valid = isWithinRoom(moving, room.ancho, room.largo) &&
      !others.some(f => isOverlapping(moving, f));
    // Si no es válido, no actualiza
    if (!valid) return;
    // Actualiza posición
    const updated = [...furniture];
    updated[idx] = moving;
    setFurniture(updated);
  }

  function onMouseUp() {
    setDraggingId(null);
  }

  useEffect(() => {
    if (draggingId) {
      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUp);
      return () => {
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('mouseup', onMouseUp);
      };
    }
  });

  // Colores por tipo
  const typeColors = {
    sofa: '#fbbf24',
    mesa: '#60a5fa',
    silla: '#34d399',
    cama: '#f472b6',
    armario: '#a78bfa',
    otro: '#d1d5db',
  };

  // Render
  return (
    <div className="overflow-auto">
      <svg
        id="room2d-svg"
        width={svgWidth}
        height={svgHeight}
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        className="border border-gray-300 bg-gray-50"
        style={{ touchAction: 'none', userSelect: 'none' }}
      >
        {/* Fondo */}
        <rect x="0" y="0" width={svgWidth} height={svgHeight} fill="#f9fafb" />
        {/* Habitación */}
        <rect
          x={padding}
          y={padding}
          width={widthPx}
          height={heightPx}
          fill="#fff"
          stroke="#4a5568"
          strokeWidth="2"
        />
        {/* Muebles */}
        {furniture.map(f => {
          const color = typeColors[f.tipo] || typeColors.otro;
          const isSelected = f.id === selectedId;
          return (
            <g key={f.id}>
              <rect
                x={padding + f.x * scale}
                y={padding + f.y * scale}
                width={f.width * scale}
                height={f.height * scale}
                fill={color}
                stroke={isSelected ? '#ef4444' : '#374151'}
                strokeWidth={isSelected ? 3 : 1}
                style={{ cursor: 'move', opacity: draggingId === f.id ? 0.7 : 1 }}
                onMouseDown={e => { onMouseDown(e, f); setSelectedId(f.id); }}
              />
              {/* Nombre */}
              <text
                x={padding + f.x * scale + (f.width * scale) / 2}
                y={padding + f.y * scale + (f.height * scale) / 2}
                textAnchor="middle"
                alignmentBaseline="middle"
                fontSize={14}
                fill="#1f2937"
                pointerEvents="none"
              >
                {f.nombre}
              </text>
            </g>
          );
        })}
        {/* Dimensiones */}
        <text
          x={padding + widthPx / 2}
          y={padding - 5}
          textAnchor="middle"
          fill="#4a5568"
          fontSize="12"
        >
          {room.ancho} m
        </text>
        <text
          x={padding - 5}
          y={padding + heightPx / 2}
          textAnchor="end"
          fill="#4a5568"
          fontSize="12"
          transform={`rotate(-90 ${padding - 5}, ${padding + heightPx / 2})`}
        >
          {room.largo} m
        </text>
      </svg>
      <div className="text-xs text-gray-500 mt-1">Arrastra los muebles. Selecciona y presiona Delete para eliminar.</div>
    </div>
  );
}
