// src/components/Room2DView.jsx

import React from 'react'

/**
 * Room2DView dibuja una representación sencilla de una habitación en SVG.
 * 
 * Props:
 *  - ancho: ancho de la habitación en metros (ej. 5)
 *  - largo: largo de la habitación en metros (ej. 4)
 *  - puertas: número de puertas (ej. 1)
 *  - ventanas: número de ventanas (ej. 2)
 *  - scale (opcional): escala en pixeles/metro (por defecto 80 px por metro)
 *
 * Este componente asume:
 *  - La puerta será dibujada (si existe) en la pared inferior, centrada, con ancho 0.8 m y grosor de 0.1 m.
 *  - Las ventanas (si existen 2) se dibujan: una centro de la pared izquierda y otra centro de la pared derecha, cada ventana de ancho 1 m y grosor 0.1 m.
 */
export default function Room2DView({
  ancho = 5,
  largo = 4,
  puertas = 1,
  ventanas = 2,
  scale = 80 // 80 px por metro
}) {
  // Convertimos metros a pixeles
  const widthPx = ancho * scale
  const heightPx = largo * scale

  // Constantes de dibujo (en metros)
  const puertaAncho = 0.8 // 0.8 m de ancho
  const puertaGrosor = 0.1 // grosor en metros (espesor de pared)
  const ventanaAncho = 1.0  // 1 m de ancho para cada ventana
  const ventanaGrosor = 0.1 // grosor en metros

  // Convertir a pixeles
  const puertaAnchoPx = puertaAncho * scale
  const puertaGrosorPx = puertaGrosor * scale
  const ventanaAnchoPx = ventanaAncho * scale
  const ventanaGrosorPx = ventanaGrosor * scale

  // Coordenadas de la puerta (en una posición centrada en la pared inferior)
  // El SVG se asume con origen (0,0) en la esquina superior izquierda,
  // X crece hacia la derecha, Y crece hacia abajo.
  const puertaX = (widthPx - puertaAnchoPx) / 2
  const puertaY = heightPx - puertaGrosorPx

  // Coordenadas de las ventanas:
  // - Ventana 1 en pared izquierda, centrada verticalmente
  const ventana1X = 0
  const ventana1Y = (heightPx - ventanaAnchoPx) / 2

  // - Ventana 2 en pared derecha, centrada verticalmente
  const ventana2X = widthPx - ventanaGrosorPx
  const ventana2Y = (heightPx - ventanaAnchoPx) / 2

  // Para dar un poco de padding visual dentro de un contenedor, envolveremos el SVG en un <svg> más grande.
  // Añadimos 20px de margen en cada lado (top/right/bottom/left).
  const padding = 20
  const svgWidth = widthPx + padding * 2
  const svgHeight = heightPx + padding * 2

  return (
    <div className="overflow-auto">
      <svg
        width={svgWidth}
        height={svgHeight}
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        className="border border-gray-300 bg-gray-50"
      >
        {/* Dibujamos el fondo gris muy claro */}
        <rect
          x="0"
          y="0"
          width={svgWidth}
          height={svgHeight}
          fill="#f9fafb"
        />

        {/* Dibujamos el contorno de la habitación (piso) */}
        <rect
          x={padding}
          y={padding}
          width={widthPx}
          height={heightPx}
          fill="#ffffff"
          stroke="#4a5568"
          strokeWidth="2"
        />

        {/* Dibujar puerta (solo si puertas >= 1) */}
        {puertas > 0 && (
          <rect
            x={padding + puertaX}
            y={padding + puertaY}
            width={puertaAnchoPx}
            height={puertaGrosorPx}
            fill="#b5651d" // marrón para la puerta
            stroke="#78350f"
            strokeWidth="1"
          />
        )}

        {/* Dibujar ventanas (solo si ventanas >= 1) */}
        {ventanas >= 1 && (
          <>
            {/* Ventana izquierda */}
            <rect
              x={padding + ventana1X}
              y={padding + ventana1Y}
              width={ventanaGrosorPx}
              height={ventanaAnchoPx}
              fill="#93c5fd" // azul claro para cristal
              stroke="#3b82f6"
              strokeWidth="1"
            />
          </>
        )}
        {ventanas >= 2 && (
          <>
            {/* Ventana derecha */}
            <rect
              x={padding + ventana2X}
              y={padding + ventana2Y}
              width={ventanaGrosorPx}
              height={ventanaAnchoPx}
              fill="#93c5fd"
              stroke="#3b82f6"
              strokeWidth="1"
            />
          </>
        )}

        {/* Opcional: etiquetar dimensiones con texto */}
        <text
          x={padding + widthPx / 2}
          y={padding - 5}
          textAnchor="middle"
          fill="#4a5568"
          fontSize="12"
        >
          {ancho} m
        </text>
        <text
          x={padding - 5}
          y={padding + heightPx / 2}
          textAnchor="end"
          fill="#4a5568"
          fontSize="12"
          transform={`rotate(-90 ${padding - 5}, ${padding + heightPx / 2})`}
        >
          {largo} m
        </text>
      </svg>
    </div>
  )
}
