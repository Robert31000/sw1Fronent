import React from 'react';
import { useDrag } from 'react-dnd';

const FURNITURE_CATALOG = [
  { id: 'sofa', name: 'Sofá', modelUrl:'/models/sofa.glb', scale: [0.02, 0.02, 0.02], color: '#a0522d', image: '/images/sofa.png' },
  { id: 'mesa', name: 'Mesa', type: 'cube', size: [1, 0.4, 0.6], color: '#deb887', image: '/images/table.png' },
//   { id: 'silla', name: 'Silla', type: 'cube', size: [0.5, 0.5, 0.5], color: '#333', image: '/images/chair.jpg' },
  { id: 'silla', name: 'Silla', modelUrl: '/models/wood_chair.glb', scale: [0.7, 0.4, 0.7], color: '#333', image: '/images/chair.jpg' },
  { id: 'sillon', name: 'Sillon', modelUrl: '/models/armchair.glb', scale: [0.01, 0.01, 0.01], color: '#333', image: '/images/sillon.png'},
  { id: 'mesa', name: 'Mesa', modelUrl: '/models/modern_table.glb', scale: [0.7, 0.7, 0.7], color: '#333', image: '/images/table.png'},
  { id: 'cama', name: 'Cama', modelUrl: '/models/bed.glb', scale: [0.01, 0.01, 0.01], color: '#333', image: '/images/bed.png'},
  { id: 'desk', name: 'Escritorio', modelUrl: '/models/desk.glb', scale: [0.5, 0.5, 0.5], color: '#333', image: '/images/escritorio.png'},
  { id: 'mesas', name: '3 Mesas', modelUrl: '/models/table.glb', scale: [1, 1, 1], color: '#333', image: '/images/table.png'},
  { id: 'glasstable', name: 'Mesa Vidrio', modelUrl: '/models/glass_table.glb', scale: [0.7, 0.7, 0.7], color: '#333', image: '/images/table_glass.png'},
  { id: 'mesa2', name: 'Mesa 2', modelUrl: '/models/source.glb', scale: [0.7, 0.7, 0.7], color: '#333', image: '/images/table.png'},
  // { id: 'comedor', name: 'Comedor', type: 'cube', size: [0.5, 0.5, 0.5], color: '#333', image: '/images/comedor.png' },
  // { id: 'escritorio', name: 'Escritorio', type: 'cube', size: [0.5, 0.5, 0.5], color: '#333', image: '/images/desk.jpg' },
  // { id: 'closet', name: 'Closet', type: 'cube', size: [0.5, 0.5, 0.5], color: '#333', image: '/images/closet.jpg' },
  // ...agrega más muebles y sus imágenes
];

function FurnitureItem({ item }) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'FURNITURE',
    item,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }), [item]);
  return (
    <div
      ref={drag}
      className={`p-2 border rounded cursor-move bg-white shadow ${isDragging ? 'opacity-50' : ''}`}
      style={{ width: 80, textAlign: 'center' }}
    >
      <img src={item.image} alt={item.name} style={{ width: 48, height: 48, objectFit: 'contain' }} />
      <div className="text-xs mt-1">{item.name}</div>
    </div>
  );
}

export default function FurnitureCatalogPanel() {
  return (
    <div className="flex gap-2 overflow-x-auto p-2 bg-gray-100 rounded">
      {FURNITURE_CATALOG.map(item => (
        <FurnitureItem key={item.id} item={item} />
      ))}
    </div>
  );
}