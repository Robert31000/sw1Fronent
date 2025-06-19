import React from "react";

const wallMaterials = ["Pintura", "Papel Tapiz", "Ladrillo"];
const floorMaterials = ["Madera", "Cerámica", "Alfombra"];

export default function RoomCustomizationPanel({ room, setRoom }) {
  return (
    <div className="p-4 bg-white rounded shadow space-y-4">
      <div>
        <label>Paredes: </label>
        <input
          type="color"
          value={room.wallColor}
          onChange={e => setRoom(prev => ({ ...prev, wallColor: e.target.value }))}
        />
        <select
          value={room.wallMaterial}
          onChange={e => setRoom(prev => ({ ...prev, wallMaterial: e.target.value }))}
        >
          {wallMaterials.map(m => <option key={m}>{m}</option>)}
        </select>
      </div>
      <div>
        <label>Piso: </label>
        <input
          type="color"
          value={room.floorColor}
          onChange={e => setRoom(prev => ({ ...prev, floorColor: e.target.value }))}
        />
        <select
          value={room.floorMaterial}
          onChange={e => setRoom(prev => ({ ...prev, floorMaterial: e.target.value }))}
        >
          {floorMaterials.map(m => <option key={m}>{m}</option>)}
        </select>
      </div>
    </div>
  );
}