import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import React, { Suspense, useMemo, useRef } from "react";
import { Color, PointLight, RepeatWrapping } from "three";
import { TextureLoader } from "three/src/loaders/TextureLoader";

const woodTextures = ["Color", "Displacement", "Normal", "Roughness"].map(
  (type) => `assets/Wood023_1K_${type}.jpg`
);

export default function App() {
  return (
    <Canvas style={{ width: "100vw", height: "100vh" }}>
      <Scene />
    </Canvas>
  );
}
const Scene = () => {
  const lightRef = useRef<PointLight>();
  useFrame(() => {
    if (lightRef.current) {
      lightRef.current.position.x += 0.025;
      lightRef.current.position.y -= 0.025;
    }
  });
  return (
    <>
      <ambientLight />
      <pointLight ref={lightRef} position={[-4, 4, 10]} power={5} />
      <Suspense fallback={null}>
        <Board />
        <Ball />
      </Suspense>
    </>
  );
};

const Ball = () => {
  return (
    <mesh position={[0, 0, 0.3]}>
      <sphereGeometry args={[0.15, 15, 15]} />
      <meshStandardMaterial color={"white"} metalness={1} roughness={0.4} />
    </mesh>
  );
};

const Board = () => {
  const textureLoad = useLoader(TextureLoader, woodTextures);
  const [map, displacement, normal, roughness] = useMemo(
    () =>
      textureLoad.map((texture) => {
        texture.wrapS = RepeatWrapping;
        texture.wrapT = RepeatWrapping;
        //texture.offset.set(0, 0.1);
        texture.repeat.set(3, 3);
        return texture;
      }),
    [textureLoad]
  );
  return (
    <mesh>
      <planeGeometry args={[5, 5]} />
      <meshPhysicalMaterial
        map={map}
        displacementMap={displacement}
        normalMap={normal}
        roughnessMap={roughness}
        roughness={0.8}
        metalness={0.5}
      />
    </mesh>
  );
};
