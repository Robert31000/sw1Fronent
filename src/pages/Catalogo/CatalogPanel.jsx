import React, { useState } from "react";
import { furnitureCatalog } from '../Habitacion/dataroom/furnitureCatalog';

export default function CatalogPanel({ onSelect }) {
  const [filter, setFilter] = useState({ type: "", color: "", style: "", material: "" });

  const filtered = furnitureCatalog.filter(item =>
    (!filter.type || item.type === filter.type) &&
    (!filter.color || item.color === filter.color) &&
    (!filter.style || item.style === filter.style) &&
    (!filter.material || item.material === filter.material)
  );

  // Obtén valores únicos para los filtros
  const types = [...new Set(furnitureCatalog.map(i => i.type))];
  const colors = [...new Set(furnitureCatalog.map(i => i.color))];
  const styles = [...new Set(furnitureCatalog.map(i => i.style).filter(Boolean))];
  const materials = [...new Set(furnitureCatalog.map(i => i.material).filter(Boolean))];

  return (
    <div>
      <div className="flex gap-2 mb-2">
        <select onChange={e => setFilter(f => ({ ...f, type: e.target.value }))}>
          <option value="">Tipo</option>
          {types.map(type => <option key={type}>{type}</option>)}
        </select>
        <select onChange={e => setFilter(f => ({ ...f, color: e.target.value }))}>
          <option value="">Color</option>
          {colors.map(color => <option key={color}>{color}</option>)}
        </select>
        <select onChange={e => setFilter(f => ({ ...f, style: e.target.value }))}>
          <option value="">Estilo</option>
          {styles.map(style => <option key={style}>{style}</option>)}
        </select>
        <select onChange={e => setFilter(f => ({ ...f, material: e.target.value }))}>
          <option value="">Material</option>
          {materials.map(material => <option key={material}>{material}</option>)}
        </select>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {filtered.map(item => (
          <div key={item.id} onClick={() => onSelect(item)} className="cursor-pointer border p-2 rounded">
            <img src={item.image} alt={item.name} className="w-16 h-16 object-contain" />
            <div>{item.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
}