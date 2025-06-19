// src/components/Room2DEditor.jsx

import React, { useState, useRef } from 'react'
import { Stage, Layer, Rect, Group, Text , Image as KonvaImage} from 'react-konva'
import useImage from "use-image";
import { furnitureCatalog } from './dataroom/furnitureCatalog'

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

  return (
    <div className="flex">
      {/* Lado izquierdo: canvas de habitación */}
      <div
        className="border border-gray-300 bg-gray-50"
        style={{
          width: roomWidthPx + 2,
          height: roomHeightPx + 2,
          position: "relative",
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
      {/* Lado derecho: catálogo de muebles */}
      <div className="ml-6 flex-1">
        <h3 className="text-lg font-semibold mb-2">Catálogo de Muebles</h3>
        <div className="grid grid-cols-1 gap-3 max-h-[80vh] overflow-y-auto">
          {furnitureCatalog.map((item) => {
            // Convertimos a pixeles para mostrar un “preview” pequeño
            const widthPx = (item.ancho ?? 1) * (scale / 3);
            const heightPx = (item.largo ?? 1) * (scale / 3);
            return (
              <div
                key={item.id}
                className="flex items-center gap-3 p-2 bg-white shadow rounded cursor-grab"
                draggable
                onDragStart={() => handleDragStartFromCatalog(item)}
              >
                <div
                  style={{
                    width: widthPx,
                    height: heightPx,
                    backgroundColor: item.color,
                    border: "1px solid #333",
                  }}
                />
                <span className="text-sm text-gray-700">{item.nombre}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
