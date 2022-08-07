import {
  OrbitControls,
  PerspectiveCamera,
  shaderMaterial,
} from "@react-three/drei";
import React, { useEffect, useRef, useState } from "react";
import glsl from "babel-plugin-glsl/macro";
import * as THREE from "three";

import { extend, useFrame } from "@react-three/fiber";
const Scene = () => {

const materialRef = useRef();

  const WavedMaterial = shaderMaterial(
    {
      uColor: new THREE.Color(0xffff00),
      uMouse: { x: 0.0, y: 0.0 },
      uResolution: { x: 0.0, y: 0.0 },
      uTime: 0.0,
    },
    // vertex shader
    glsl`
    void main() {
      gl_Position = projectionMatrix * modelViewMatrix * vec4
      (position * 0.5, 1.0);
    }
    `,
    // fragment shader
    glsl`
    uniform vec3 uColor;
    uniform vec2 uMouse;
    uniform float uTime;
    void main() {
      float tCol = (sin(uTime) + 1.0) / 2.0;
      vec3 color = vec3(uMouse.x, tCol, uMouse.y);
      gl_FragColor = vec4(color, 1.0);
    }
    `
  );
  extend({ WavedMaterial });

 
// const {screenWidth, height} = useMemo(()=>)

  const [mousePos, setMousePos] = useState({x:0, y:0})

  useEffect(()=>{
    document.addEventListener('mousemove', (e)=>{
      const {x,y} = e;
      const percX = (x / window.innerWidth)
      const percY = (y / window.innerHeight)
      setMousePos({x:percX,y:percY})
    })
  },[])

useFrame((state, delta)=>{
  materialRef.current.material.uniforms.uTime.value = state.clock.getElapsedTime();
  // console.log('M',mat)
})
  return (
    <>
      <OrbitControls />
      <PerspectiveCamera position={[0, 0, 100]} makeDefault />
      <ambientLight color="white" />
      <mesh ref={materialRef}>
        <planeGeometry args={[40, 40]} />
        <wavedMaterial key={WavedMaterial.key} uMouse={mousePos}  uColor="hotpink" time={1} />
      </mesh>
    </>
  );
};

export default Scene;
