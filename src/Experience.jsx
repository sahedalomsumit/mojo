import React, { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { 
  Environment, 
  PerspectiveCamera, 
  Float, 
  ContactShadows, 
  PresentationControls,
  Float as FloatDrei
} from '@react-three/drei';
import { 
  EffectComposer, 
  Bloom, 
  ChromaticAberration, 
  Noise, 
  Vignette,
  DepthOfField
} from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import * as THREE from 'three';

// Custom Shader for Realistic Bubbles (Redesigned for Storytelling)
const BubbleMaterial = {
  uniforms: {
    time: { value: 0 },
    color: { value: new THREE.Color('#ffffff') },
    intensity: { value: 0.5 },
  },
  vertexShader: `
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vViewPosition;
    uniform float time;
    uniform float intensity;

    void main() {
      vUv = uv;
      vNormal = normalize(normalMatrix * normal);
      
      vec3 pos = position;
      // Intensity-based wobble (higher during "Pop" scene)
      pos.x += sin(pos.y * 10.0 + time * 2.0) * 0.05 * intensity;
      pos.z += cos(pos.x * 10.0 + time * 2.0) * 0.05 * intensity;

      vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
      vViewPosition = -mvPosition.xyz;
      gl_Position = projectionMatrix * mvPosition;
    }
  `,
  fragmentShader: `
    uniform vec3 color;
    varying vec3 vNormal;
    varying vec3 vViewPosition;

    void main() {
      vec3 viewDir = normalize(vViewPosition);
      float fresnel = pow(1.0 - max(0.0, dot(viewDir, vNormal)), 2.0);
      
      float alpha = fresnel * 0.2 + 0.02; // Much more subtle
      vec3 finalColor = mix(color, vec3(1.0), fresnel);
      
      gl_FragColor = vec4(finalColor, alpha);
    }
  `,
};

const CokeCan = ({ scrollProgress }) => {
  const canRef = useRef();
  const labelTexture = useLoader(THREE.TextureLoader, 'mojo-label.png');
  const dropsTexture = useLoader(THREE.TextureLoader, 'water-drops.png');

  labelTexture.anisotropy = 16;
  dropsTexture.wrapS = dropsTexture.wrapT = THREE.RepeatWrapping;
  dropsTexture.repeat.set(2, 2);

  useFrame((state) => {
    if (canRef.current) {
      // STORYTELLING LOGIC: Define keyframes based on scrollProgress (0 to 1)
      
      // Scene 1: 0.0 - 0.2 (Hero)
      // Scene 2: 0.2 - 0.5 (Innovation)
      // Scene 3: 0.5 - 0.8 (Heritage)
      // Scene 4: 0.8 - 1.0 (CTA)

      const isMobile = window.innerWidth < 768;
      
      let targetX = 0;
      let targetY = 0;
      let targetZ = 0;
      // Adjusted to show the MOJO text side based on the label texture
      let targetRotY = (scrollProgress * Math.PI * 8) + (Math.PI * 1.3); 
      let targetRotZ = 0;
      let targetScale = isMobile ? 0.8 : 1;

      if (scrollProgress < 0.2) {
        // Hero - Majestic Center
        targetX = 0;
        targetZ = isMobile ? 0 : 2;
        targetRotZ = 0;
      } else if (scrollProgress < 0.4) {
        // Energy - Zoom in & Tilt Left
        const p = (scrollProgress - 0.2) / 0.2;
        targetX = isMobile ? 0 : THREE.MathUtils.lerp(0, -2, p);
        targetZ = isMobile ? THREE.MathUtils.lerp(0, 2, p) : THREE.MathUtils.lerp(2, 4, p);
        targetRotZ = THREE.MathUtils.lerp(0, 0.5, p);
      } else if (scrollProgress < 0.6) {
        // Spirit - Move to Right side
        const p = (scrollProgress - 0.4) / 0.2;
        targetX = isMobile ? 0 : THREE.MathUtils.lerp(-2, 2, p);
        targetZ = isMobile ? THREE.MathUtils.lerp(2, 0, p) : THREE.MathUtils.lerp(4, 1, p);
        targetRotZ = THREE.MathUtils.lerp(0.5, -0.3, p);
      } else if (scrollProgress < 0.8) {
        // Support Palestine - Move to Left Side
        const p = (scrollProgress - 0.6) / 0.2;
        targetX = isMobile ? 0 : THREE.MathUtils.lerp(2, -2, p);
        targetZ = isMobile ? THREE.MathUtils.lerp(0, 2, p) : THREE.MathUtils.lerp(1, 3, p);
        targetRotZ = THREE.MathUtils.lerp(-0.3, 0.2, p);
      } else {
        // Magic & Footer - Center scale then move away
        const p = (scrollProgress - 0.8) / 0.2;
        if (p < 0.5) {
          // Hero Pose for Magic
          const p2 = p * 2;
          targetX = isMobile ? 0 : THREE.MathUtils.lerp(-2, 0, p2);
          targetZ = isMobile ? THREE.MathUtils.lerp(2, 3, p2) : THREE.MathUtils.lerp(3, 4, p2);
          targetScale = THREE.MathUtils.lerp(isMobile ? 0.8 : 1, isMobile ? 1.1 : 1.3, p2);
        } else {
          // Move away for Footer but keep it bigger
          const p2 = (p - 0.5) * 2;
          targetX = isMobile ? THREE.MathUtils.lerp(0, 0, p2) : THREE.MathUtils.lerp(0, 4, p2);
          targetZ = isMobile ? THREE.MathUtils.lerp(3, 1, p2) : THREE.MathUtils.lerp(4, -1, p2);
          targetScale = THREE.MathUtils.lerp(isMobile ? 0.8 : 1, isMobile ? 1.0 : 1.1, p2); 
        }
      }

      // Smooth Interpolation
      canRef.current.position.x = THREE.MathUtils.lerp(canRef.current.position.x, targetX, 0.05);
      canRef.current.position.z = THREE.MathUtils.lerp(canRef.current.position.z, targetZ, 0.05);
      canRef.current.rotation.y = THREE.MathUtils.lerp(canRef.current.rotation.y, targetRotY, 0.05);
      canRef.current.rotation.z = THREE.MathUtils.lerp(canRef.current.rotation.z, targetRotZ, 0.05);
      canRef.current.scale.setScalar(THREE.MathUtils.lerp(canRef.current.scale.x, targetScale, 0.05));
      
      // Floating effect
      canRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.8) * 0.2;
    }
  });

  return (
    <group ref={canRef}>
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[1, 1, 3.2, 64]} />
        <meshStandardMaterial 
          map={labelTexture} 
          bumpMap={dropsTexture}
          bumpScale={0.05}
          metalness={0.6}
          roughness={0.4}
          envMapIntensity={1.5}
        />


      </mesh>
      
      <mesh position={[0, 1.6, 0]}>
        <cylinderGeometry args={[1, 0.95, 0.1, 64]} />
        <meshStandardMaterial color="#ffffff" metalness={0.9} roughness={0.1} envMapIntensity={3} />
      </mesh>

      <mesh position={[0, -1.6, 0]}>
        <cylinderGeometry args={[0.95, 1, 0.1, 64]} />
        <meshStandardMaterial color="#ffffff" metalness={0.9} roughness={0.1} envMapIntensity={3} />
      </mesh>

    </group>
  );
};

const AdvancedBubbles = ({ scrollProgress }) => {
  const isMobile = window.innerWidth < 768;
  const count = isMobile ? 60 : 120;
  const meshRef = useRef();
  const materialRef = useRef();
  
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      const speed = 0.02 + Math.random() * 0.04;
      const x = (Math.random() - 0.5) * (isMobile ? 10 : 20);
      const y = (Math.random() - 0.5) * 20;
      // Strictly behind the can (can is around z=0 to z=4)
      // Camera is at z=12. Keeping them at z < -2 ensures they never get too close.
      const z = -5 - Math.random() * 10; 
      const size = 0.05 + Math.random() * 0.1;
      temp.push({ speed, x, y, z, size });
    }
    return temp;
  }, [count]);

  useFrame((state) => {
    materialRef.current.uniforms.time.value = state.clock.elapsedTime;
    // Increase bubble intensity during specific scroll points
    materialRef.current.uniforms.intensity.value = 0.5 + scrollProgress * 2.5;
    
    particles.forEach((p, i) => {
      const dummy = new THREE.Object3D();
      p.y += p.speed * (1 + scrollProgress); // Bubbles go faster as we "open" the can
      if (p.y > 10) p.y = -10;
      
      dummy.position.set(p.x, p.y, p.z);
      dummy.scale.set(p.size, p.size, p.size);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[null, null, count]}>
      <sphereGeometry args={[1, 16, 16]} />
      <shaderMaterial 
        ref={materialRef}
        {...BubbleMaterial}
        transparent={true}
        depthWrite={false}
      />
    </instancedMesh>
  );
};

const Experience = ({ scrollProgress }) => {
  return (
    <div className="canvas-container">
      <Canvas shadows={{ type: THREE.PCFShadowMap }} dpr={[1, 2]} gl={{ toneMappingExposure: 1.0 }}>
        <React.Suspense fallback={null}>
          <PerspectiveCamera makeDefault position={[0, 0, 12]} fov={25} />


        
        <ambientLight intensity={0.8} />
        <spotLight position={[5, 10, 5]} angle={0.2} penumbra={1} intensity={50} castShadow />
        <pointLight position={[-5, 2, 5]} intensity={20} color="#ffffff" />
        <directionalLight position={[0, 5, 10]} intensity={1.5} />
        <directionalLight position={[-5, 0, 2]} intensity={0.5} color="#ffffff" />



        
        <PresentationControls
          global
          config={{ mass: 1, tension: 500 }}
          snap={{ mass: 2, tension: 1500 }}
          rotation={[0, 0, 0]}
          polar={[-Math.PI / 12, Math.PI / 12]}
          azimuth={[-Math.PI / 8, Math.PI / 8]}
        >
          <CokeCan scrollProgress={scrollProgress} />
        </PresentationControls>

        <AdvancedBubbles scrollProgress={scrollProgress} />

        <EffectComposer multisampling={4}>
          <Bloom 
            intensity={0.5} 
            luminanceThreshold={0.9} 
            luminanceSmoothing={0.1} 
          />
          <ChromaticAberration offset={[0.0005, 0.0005]} />
          <Vignette eskil={false} offset={0.1} darkness={1.1} />
        </EffectComposer>


        <ContactShadows 
          position={[0, -4, 0]} 
          opacity={0.6} 
          scale={30} 
          blur={4} 
          far={10} 
        />
        
        <Environment preset="city" />
        </React.Suspense>
      </Canvas>
    </div>
  );
};

export default Experience;
