// src/components/Room2DEditor.jsx

import React, { useState, useRef } from 'react'
import { Stage, Layer, Rect, Group, Text , Image as KonvaImage} from 'react-konva'
import useImage from "use-image";
import { furnitureCatalog } from './dataroom/furnitureCatalog'
import jsPDF from 'jspdf';

/**
 * Room2DEditor
 *
 * props:
 *   - preset: { ancho, largo, alto, colorPared, colorPiso }
 *   - scale: pixelesPorMetro (por ejemplo, 70)
 *
 * Dentro del editor el usuario podrá:
 *   - Arrastrar un mueble desde el catálogo (a la derecha) y soltarlo en la habitación (a la izquierda).
 *   - Mover muebles ya colocados (draggable=true).
 *   - Más adelante: rotar, eliminar, cambiar tamaño, etc.
 */

function Door({ x, y, width, height, rotation, image }) {
  const [img] = useImage(image);
  return (
    <KonvaImage
      x={x || 0}
      y={y || 0}
      width={width || 80} // ancho por defecto 80px
      height={height || 200} // alto por defecto 200px
      rotation={rotation}
      image={img}
      draggable
    />
  );
}

function Window({ x, y, width, height, rotation, image }) {
  const [img] = useImage(image);
  return (
    <KonvaImage
      x={x || 0} 
      y={y || 0}
      width={width || 120} // ancho por defecto 120px
      height={height || 100} // alto por defecto 100px
      rotation={rotation}
      image={img}
      draggable
    />
  );
}

export default function Room2DEditor({ room, preset, scale = 70 }) {
  // Evita error si preset es undefined o no tiene ancho/largo
  const roomWidthPx = (preset?.ancho ?? 5) * scale;
  const roomHeightPx = (preset?.largo ?? 4) * scale;

  // Estado: lista de muebles ubicados en la habitación
  const [placedFurniture, setPlacedFurniture] = useState([]);

  // Estado: Trackear si estamos arrastrando un mueble del catálogo
  const [draggingFurniture, setDraggingFurniture] = useState(null);
  // Para generar IDs únicos de instancias:
  const nextInstanceIdRef = useRef(1);

  // Referencia al Stage para detectar coordenadas de drop
  const stageRef = useRef();

  // Handler: cuando se comienza a arrastrar un item del catálogo
  const handleDragStartFromCatalog = (item) => {
    setDraggingFurniture(item);
  };

  // Handler: cuando se suelta sobre el Stage (área de la habitación)
  const handleDropOnStage = (e) => {
    e.evt.preventDefault();

    if (!draggingFurniture) return;

    // Obtener la posición del cursor dentro del Stage
    const pointerPos = stageRef.current.getPointerPosition();

    // Medir tamaño del mueble en pixeles, usando valores seguros
    const widthPx = (draggingFurniture.ancho ?? 1) * scale;
    const heightPx = (draggingFurniture.largo ?? 1) * scale;

    // Creamos una nueva instancia de mueble con posicionamiento centrado en el cursor
    const newInstance = {
      instanceId: nextInstanceIdRef.current++,
      id: draggingFurniture.id,
      nombre: draggingFurniture.nombre,
      color: draggingFurniture.color,
      x: pointerPos.x - widthPx / 2,
      y: pointerPos.y - heightPx / 2,
      widthPx,
      heightPx,
    };

    setPlacedFurniture((prev) => [...prev, newInstance]);
    setDraggingFurniture(null);
  };

  // Handler: mover muebles ya colocados (drag & drop dentro de la habitación)
  const handleDragMovePlaced = (e, instanceId) => {
    const { x, y } = e.target.attrs;
    setPlacedFurniture((prev) =>
      prev.map((m) =>
        m.instanceId === instanceId
          ? { ...m, x, y }
          : m
      )
    );
  };

  function handleExportImage() {
    if (stageRef.current) {
      const dataURL = stageRef.current.toDataURL({ pixelRatio: 2 });
      const link = document.createElement('a');
      link.download = 'habitacion.png';
      link.href = dataURL;
      link.click();
    }
  }

  function handleExportPDF() {
    if (stageRef.current) {
      const dataURL = stageRef.current.toDataURL({ pixelRatio: 2 });
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'px',
        format: [stageRef.current.width(), stageRef.current.height()]
      });
      pdf.addImage(dataURL, 'PNG', 0, 0, stageRef.current.width(), stageRef.current.height());
      pdf.save('habitacion.pdf');
    }
  }

  return (
    <div className="flex w-full" style={{ minHeight: roomHeightPx + 2, position: 'relative' }}>
      {/* Panel de botones de exportación */}
      <div className="absolute z-10 left-4 top-4 flex gap-2">
        <button
          className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 shadow"
          onClick={handleExportImage}
        >
          Exportar como imagen
        </button>
        <button
          className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 shadow"
          onClick={handleExportPDF}
        >
          Exportar como PDF
        </button>
      </div>
      {/* Lado izquierdo: canvas de habitación */}
      <div
        className="border border-gray-300 bg-gray-50"
        style={{
          width: roomWidthPx + 2,
          height: roomHeightPx + 2,
          position: "relative",
          flexShrink: 0,
        }}
      >
        <Stage
          width={roomWidthPx + 2}
          height={roomHeightPx + 2}
          onDrop={handleDropOnStage}
          onDragOver={(e) => e.evt.preventDefault()}
          ref={stageRef}
        >
          <Layer>
            {/* Piso de la habitación */}
            <Rect
              x={1}
              y={1}
              width={roomWidthPx}
              height={roomHeightPx}
              fill={preset?.colorPiso || "#e0cda9"}
              stroke={preset?.colorPared || "#f5f5f5"}
              strokeWidth={2}
            />
            {/* Puertas */}
            {(room?.doors || []).map((door) => (
              <Door key={door.id} {...door} image={door.image || "/assets/door.png"} />
            ))}
            {/* Ventanas */}
            {(room?.windows || []).map((window) => (
              <Window key={window.id} {...window} image={window.image || "/assets/window.png"} />
            ))}
            {/* Etiquetas de dimensiones en metros */}
            <Text
              x={roomWidthPx / 2}
              y={-10}
              text={`${preset?.ancho ?? 5} m`}
              fill="#4a5568"
              fontSize={14}
              align="center"
            />
            <Text
              x={-30}
              y={roomHeightPx / 2}
              text={`${preset?.largo ?? 4} m`}
              fill="#4a5568"
              fontSize={14}
              rotation={-90}
              align="center"
            />
            {/* Muebles colocados */}
            {placedFurniture.map((mueble) => (
              <Group
                key={mueble.instanceId}
                draggable
                x={mueble.x}
                y={mueble.y}
                onDragMove={(e) =>
                  handleDragMovePlaced(e, mueble.instanceId)
                }
              >
                <Rect
                  x={0}
                  y={0}
                  width={mueble.widthPx}
                  height={mueble.heightPx}
                  fill={mueble.color}
                  stroke="#333"
                  strokeWidth={1}
                  opacity={0.8}
                />
                <Text
                  x={4}
                  y={4}
                  text={mueble.nombre}
                  fontSize={12}
                  fill="#fff"
                />
              </Group>
            ))}
          </Layer>
        </Stage>
      </div>
      {/* Panel lateral derecho: Catálogo visual */}
      <div
        className="w-56 bg-white border-l border-gray-200 p-2 overflow-y-auto"
        style={{ minHeight: roomHeightPx + 2 }}
      >
        <div className="font-semibold text-gray-700 mb-2 text-center">Catálogo de muebles</div>
        <div className="flex flex-col gap-2">
          {furnitureCatalog.map((item) => (
            <div
              key={item.id}
              className="flex flex-col items-center p-2 border rounded hover:bg-blue-50 cursor-grab"
              draggable
              onDragStart={() => handleDragStartFromCatalog(item)}
              style={{ opacity: draggingFurniture?.id === item.id ? 0.5 : 1 }}
            >
              {/* Imagen si existe */}
              {item.image ? (
                <img
                  src={item.image}
                  alt={item.nombre || item.name}
                  className="w-16 h-16 object-contain mb-1"
                  draggable={false}
                />
              ) : (
                <div
                  className="w-16 h-16 flex items-center justify-center mb-1 rounded"
                  style={{ background: item.color || "#eee" }}
                >
                  <span className="text-xs text-gray-600">{item.nombre || item.name}</span>
                </div>
              )}
              <div className="text-xs text-gray-800 text-center">
                {item.nombre || item.name}
              </div>
              {/* Dimensiones si existen */}
              <div className="text-[10px] text-gray-500">
                {item.ancho || item.width ? `${item.ancho || item.width}m` : ""}{" "}
                {item.largo || item.height ? `× ${item.largo || item.height}m` : ""}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
