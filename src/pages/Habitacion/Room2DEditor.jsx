// src/components/Room2DEditor.jsx

import React, { useState, useEffect, useRef } from 'react'
import { Stage, Layer, Rect, Group, Text } from 'react-konva'
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
export default function Room2DEditor({ preset, scale = 70 }) {
  // Convertimos las dimensiones en pixeles
  const roomWidthPx = preset.ancho * scale
  const roomHeightPx = preset.largo * scale

  // Estado: lista de muebles ubicados en la habitación. Cada mueble:
  // { id, nombre, ancho, largo, color, x, y, widthPx, heightPx }
  const [placedFurniture, setPlacedFurniture] = useState([])

  // Estado: Trackear si estamos arrastrando un mueble del catálogo
  const [draggingFurniture, setDraggingFurniture] = useState(null)
  // Para generar IDs únicos de instancias:
  const nextInstanceIdRef = useRef(1)

  // Referencia al Stage para detectar coordenadas de drop
  const stageRef = useRef()

  // Handler: cuando se comienza a arrastrar un item del catálogo
  const handleDragStartFromCatalog = (item) => {
    setDraggingFurniture(item)
  }

  // Handler: cuando se suelta sobre el Stage (área de la habitación)
  const handleDropOnStage = (e) => {
    // Evitamos interacciones de etapas anidadas
    e.evt.preventDefault()

    if (!draggingFurniture) return

    // Obtener la posición del cursor dentro del Stage
    const pointerPos = stageRef.current.getPointerPosition()

    // Medir tamaño del mueble en pixeles
    const widthPx = draggingFurniture.ancho * scale
    const heightPx = draggingFurniture.largo * scale

    // Creamos una nueva instancia de mueble con posicionamiento centrado en el cursor
    const newInstance = {
      instanceId: nextInstanceIdRef.current++,
      id: draggingFurniture.id,
      nombre: draggingFurniture.nombre,
      color: draggingFurniture.color,
      // Ubicamos el centro del mueble en la posición del cursor
      x: pointerPos.x - widthPx / 2,
      y: pointerPos.y - heightPx / 2,
      widthPx,
      heightPx
    }

    setPlacedFurniture((prev) => [...prev, newInstance])
    setDraggingFurniture(null)
  }

  // Handler: mover muebles ya colocados (drag & drop dentro de la habitación)
  const handleDragMovePlaced = (e, instanceId) => {
    const { x, y } = e.target.attrs
    setPlacedFurniture((prev) =>
      prev.map((m) =>
        m.instanceId === instanceId
          ? { ...m, x, y }
          : m
      )
    )
  }

  return (
    <div className="flex">
      {/* ----------------------------- */}
      {/* Lado izquierdo: canvas de habitación */}
      {/* ----------------------------- */}
      <div
        className="border border-gray-300 bg-gray-50"
        style={{
          width: roomWidthPx + 2, // borde de 1px a cada lado
          height: roomHeightPx + 2,
          position: 'relative'
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
            {/* Dibujamos el rectángulo que representa el piso de la habitación */}
            <Rect
              x={1}
              y={1}
              width={roomWidthPx}
              height={roomHeightPx}
              fill={preset.colorPiso}
              stroke={preset.colorPared}
              strokeWidth={2}
            />

            {/* Etiquetas de dimensiones en metros (texto arriba y a la izquierda) */}
            <Text
              x={roomWidthPx / 2}
              y={-10}
              text={`${preset.ancho} m`}
              fill="#4a5568"
              fontSize={14}
              align="center"
            />
            <Text
              x={-30}
              y={roomHeightPx / 2}
              text={`${preset.largo} m`}
              fill="#4a5568"
              fontSize={14}
              rotation={-90}
              align="center"
            />

            {/* Dibujamos todos los muebles colocados */}
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

      {/* ----------------------------- */}
      {/* Lado derecho: catálogo de muebles */}
      {/* ----------------------------- */}
      <div className="ml-6 flex-1">
        <h3 className="text-lg font-semibold mb-2">Catálogo de Muebles</h3>
        <div className="grid grid-cols-1 gap-3 max-h-[80vh] overflow-y-auto">
          {furnitureCatalog.map((item) => {
            // Convertimos a pixeles para mostrar un “preview” pequeño
            const widthPx = item.ancho * (scale / 3)  // escalado más pequeño
            const heightPx = item.largo * (scale / 3)
            return (
              <div
                key={item.id}
                className="flex items-center gap-3 p-2 bg-white shadow rounded cursor-grab"
                draggable
                onDragStart={() => handleDragStartFromCatalog(item)}
              >
                {/* Preview del mueble como rectángulo pequeño */}
                <div
                  style={{
                    width: widthPx,
                    height: heightPx,
                    backgroundColor: item.color,
                    border: '1px solid #333'
                  }}
                />
                <span className="text-sm text-gray-700">{item.nombre}</span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
