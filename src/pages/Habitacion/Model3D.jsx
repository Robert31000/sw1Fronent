import React, { forwardRef } from 'react';
import { useGLTF } from '@react-three/drei';

export const Model3D = forwardRef(function Model3D({ url, position = [0, 0, 0], scale = [1, 1, 1], rotation = [0, 0, 0] }, ref) {
  const { scene } = useGLTF(url);
  React.useImperativeHandle(ref, () => scene, [scene]);
  return (
    <primitive object={scene} position={position} scale={scale} rotation={rotation} />
  );
}); 