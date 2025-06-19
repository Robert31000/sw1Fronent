import React from 'react';
import { useGLTF } from '@react-three/drei';

export function Model3D({ url, position = [0, 0, 0], scale = [1, 1, 1], rotation = [0, 0, 0] }) {
  const { scene } = useGLTF(url);
  return (
    <primitive object={scene} position={position} scale={scale} rotation={rotation} />
  );
} 