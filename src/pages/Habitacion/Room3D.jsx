import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useTexture, SoftShadows } from '@react-three/drei';
import { useDrop } from 'react-dnd';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { Model3D } from './Model3D';

// URLs de texturas públicas (puedes cambiarlas por las tuyas)
const TEXTURES = {
  Madera: '/textures/wood.png',
  Cerámica: '/textures/ceramic.png',
  Alfombra: '/textures/carpet.png',
  Yeso: '/textures/plaster.png',
  Ladrillo: '/textures/brick.png',
};
const DOOR_TEXTURES = {
  Madera: '/textures/door_wood.jpg',
  Metal: '/textures/door_metal.jpg',
  Vidrio: '/textures/door_glass.png',
};
const WINDOW_TEXTURES = {
  Vidrio: '/textures/window_glass.jpg',
  Madera: '/textures/window_wood.jpg',
  Metal: '/textures/window_metal.jpg',
};

function Wall({ width, height, position, rotation, material }) {
  const texture = useTexture(TEXTURES[material] || TEXTURES['Yeso']);
  texture.wrapS = texture.wrapT = 1000; // RepeatWrapping
  return (
    <mesh position={position} rotation={rotation} receiveShadow>
      <boxGeometry args={[width, height, 0.1]} />
      <meshStandardMaterial map={texture} />
    </mesh>
  );
}

function Floor({ width, depth, material }) {
  const texture = useTexture(TEXTURES[material] || TEXTURES['Madera']);
  texture.repeat.set(width / 2, depth / 2);
  texture.wrapS = texture.wrapT = 1000; // RepeatWrapping
  return (
    <mesh position={[0, 0, 0]} receiveShadow>
      <boxGeometry args={[width, 0.1, depth]} />
      <meshStandardMaterial map={texture} />
    </mesh>
  );
}

function DoorMesh({ door, ...props }) {
  const textures = {
    Madera: useTexture(DOOR_TEXTURES['Madera']),
    Metal: useTexture(DOOR_TEXTURES['Metal']),
    Vidrio: useTexture(DOOR_TEXTURES['Vidrio']),
  };
  const texture = textures[door.material];
  return (
    <mesh {...props}>
      <boxGeometry args={[door.width, door.height, 0.12]} />
      {door.material !== 'Personalizado' && texture ? (
        <meshStandardMaterial map={texture} />
      ) : (
        <meshStandardMaterial color={door.color || '#b5651d'} />
      )}
    </mesh>
  );
}

function WindowMesh({ window, ...props }) {
  const textures = {
    Vidrio: useTexture(WINDOW_TEXTURES['Vidrio']),
    Madera: useTexture(WINDOW_TEXTURES['Madera']),
    Metal: useTexture(WINDOW_TEXTURES['Metal']),
  };
  const texture = textures[window.material];
  return (
    <mesh {...props}>
      <boxGeometry args={[window.width, window.height, 0.12]} />
      {window.material !== 'Personalizado' && texture ? (
        <meshStandardMaterial map={texture} transparent opacity={0.5} />
      ) : (
        <meshStandardMaterial color={window.color || '#aeefff'} transparent opacity={0.5} />
      )}
    </mesh>
  );
}

// Utilidad para calcular posición y rotación de puertas/ventanas
function getWallPosition(wall, x, y, width, depth, height, elemWidth, elemHeight) {
  switch (wall) {
    case 'back':
      return { position: [x, y + (elemHeight / 2), -depth / 2 + 0.06], rotation: [0, 0, 0] };
    case 'front':
      return { position: [x, y + (elemHeight / 2), depth / 2 - 0.06], rotation: [0, Math.PI, 0] };
    case 'left':
      return { position: [-width / 2 + 0.06, y + (elemHeight / 2), x], rotation: [0, Math.PI / 2, 0] };
    case 'right':
      return { position: [width / 2 - 0.06, y + (elemHeight / 2), x], rotation: [0, -Math.PI / 2, 0] };
    default:
      return { position: [0, 0, 0], rotation: [0, 0, 0] };
  }
}

function Drop3DHandler({ onDropFurniture }) {
  const { gl, camera } = useThree();
  const [, drop] = useDrop(() => ({
    accept: 'FURNITURE',
    drop: (item, monitor) => {
      const clientOffset = monitor.getClientOffset();
      if (!clientOffset) return;
      const rect = gl.domElement.getBoundingClientRect();
      const x = ((clientOffset.x - rect.left) / rect.width) * 2 - 1;
      const y = -((clientOffset.y - rect.top) / rect.height) * 2 + 1;
      // Raycast al plano XZ (piso)
      const vector = new THREE.Vector3(x, y, 0.5).unproject(camera);
      const dir = vector.sub(camera.position).normalize();
      const distance = -camera.position.y / dir.y;
      const pos = camera.position.clone().add(dir.multiplyScalar(distance));
      if (onDropFurniture) {
        onDropFurniture(item, [pos.x, 0.25, pos.z]);
      }
    },
  }), [gl, camera, onDropFurniture]);

  React.useEffect(() => {
    if (gl && gl.domElement) {
      drop(gl.domElement);
    }
  }, [gl, drop]);

  return null;
}

const Room3D = ({
  width = 4,
  height = 2.5,
  depth = 4,
  wallMaterial = 'Yeso',
  floorMaterial = 'Madera',
  doors = [],
  windows = [],
  furniture = [],
  onDropFurniture,
}) => {
  return (
    <Canvas
      style={{ height: 450, borderRadius: 12, background: '#e0e7ef' }}
      shadows
      camera={{ position: [6, 5, 8], fov: 45 }}
    >
      <SoftShadows size={20} samples={40} focus={0.8} />
      <ambientLight intensity={0.4} color="#ffe9c6" />
      <directionalLight
        position={[8, 12, 8]}
        intensity={1.2}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />

      {/* Drop handler para drag & drop de muebles */}
      <Drop3DHandler onDropFurniture={onDropFurniture} />

      {/* Piso con textura */}
      <Floor width={width} depth={depth} material={floorMaterial} />

      {/* Paredes con textura */}
      <Wall width={width} height={height} position={[0, height / 2, -depth / 2]} rotation={[0, 0, 0]} material={wallMaterial} />
      <Wall width={width} height={height} position={[0, height / 2, depth / 2]} rotation={[0, Math.PI, 0]} material={wallMaterial} />
      <Wall width={depth} height={height} position={[-width / 2, height / 2, 0]} rotation={[0, Math.PI / 2, 0]} material={wallMaterial} />
      <Wall width={depth} height={height} position={[width / 2, height / 2, 0]} rotation={[0, -Math.PI / 2, 0]} material={wallMaterial} />

      {/* Puertas dinámicas con textura o color */}
      {doors && doors.map((door, i) => {
        const { position, rotation } = getWallPosition(door.wall, door.x, door.y, width, depth, height, door.width, door.height);
        return (
          <DoorMesh key={`door-${i}`} door={door} position={position} rotation={rotation} castShadow />
        );
      })}

      {/* Ventanas dinámicas con textura o color */}
      {windows && windows.map((window, i) => {
        const { position, rotation } = getWallPosition(window.wall, window.x, window.y, width, depth, height, window.width, window.height);
        return (
          <WindowMesh key={`window-${i}`} window={window} position={position} rotation={rotation} castShadow />
        );
      })}

      {/* Muebles: usa Model3D si hay modelUrl, si no renderiza geometría básica */}
      {furniture.map((item, idx) =>
        item.modelUrl ? (
          <Suspense fallback={null} key={idx}>
            <Model3D
              url={item.modelUrl}
              position={item.position}
              scale={item.scale || [1, 1, 1]}
              rotation={item.rotation || [0, 0, 0]}
            />
          </Suspense>
        ) : (
          (() => {
            let geometry = null;
            if (item.type === 'cube') geometry = <boxGeometry args={item.size} />;
            if (item.type === 'cylinder') geometry = <cylinderGeometry args={item.size} />;
            if (item.type === 'sphere') geometry = <sphereGeometry args={[item.size[0], 32, 32]} />;
            if (item.type === 'cone') geometry = <coneGeometry args={item.size} />;
            return (
              <mesh
                key={idx}
                position={item.position}
                rotation={item.rotation}
                castShadow
                receiveShadow
              >
                {geometry}
                <meshStandardMaterial color={item.color} roughness={0.5} metalness={0.3} />
              </mesh>
            );
          })()
        )
      )}

      <OrbitControls />
    </Canvas>
  );
};

export default Room3D;