import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';

export default function ThreeBackground() {
  const mountRef = useRef(null);

  useEffect(() => {
    let animationFrameId;
    const currentMount = mountRef.current;
    if (!currentMount) return;

    // Scene Setup
    const scene = new THREE.Scene();
    // Ultra deep premium background color
    scene.fog = new THREE.FogExp2(0x050608, 0.015);

    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 15, 40);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "high-performance" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0); 
    currentMount.appendChild(renderer.domElement);

    // Premium Studio Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
    scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0xfff5e6, 2.0);
    mainLight.position.set(10, 20, 10);
    scene.add(mainLight);

    const amberFillLight = new THREE.DirectionalLight(0xfbbf24, 3.0);
    amberFillLight.position.set(-10, 5, -15);
    scene.add(amberFillLight);

    const bottomGlow = new THREE.PointLight(0xd97706, 5, 100);
    bottomGlow.position.set(0, -10, 10);
    scene.add(bottomGlow);

    // Liquid Silk Material
    const material = new THREE.MeshStandardMaterial({
      color: 0x0a0c10, // Deep graphite base
      roughness: 0.1,  // Very smooth/glossy
      metalness: 0.8,  // Highly reflective
      wireframe: false,
    });

    // Parametric Plane
    const geometry = new THREE.PlaneGeometry(150, 150, 120, 120);
    geometry.rotateX(-Math.PI / 2);
    
    // Store original vertex positions for the math function
    const posAttribute = geometry.attributes.position;
    const originalPositions = [];
    for(let i = 0; i < posAttribute.count; i++) {
        originalPositions.push({
            x: posAttribute.getX(i),
            y: posAttribute.getY(i),
            z: posAttribute.getZ(i)
        });
    }

    const plane = new THREE.Mesh(geometry, material);
    plane.position.y = -5;
    scene.add(plane);

    // Interactive Parallax
    let mouseX = 0;
    let mouseY = 0;
    const windowHalfX = window.innerWidth / 2;
    const windowHalfY = window.innerHeight / 2;
    let targetCameraY = 15;
    let targetCameraX = 0;

    const onDocumentMouseMove = (event) => {
      mouseX = (event.clientX - windowHalfX) * 0.0005;
      mouseY = (event.clientY - windowHalfY) * 0.0005;
      
      targetCameraX = mouseX * 10;
      targetCameraY = 15 + mouseY * 10;
    };

    document.addEventListener('mousemove', onDocumentMouseMove, false);

    // Handle Window Resize
    const onWindowResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', onWindowResize, false);

    // Animation Loop
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const time = clock.getElapsedTime() * 0.4; // Speed of the wave

      // Smooth camera parallax
      camera.position.x += (targetCameraX - camera.position.x) * 0.05;
      camera.position.y += (targetCameraY - camera.position.y) * 0.05;
      camera.lookAt(0, 0, 0);

      // Procedural Liquid Math
      for(let i = 0; i < posAttribute.count; i++) {
        const orig = originalPositions[i];
        
        // Complex sine wave interference pattern
        const wave1 = Math.sin(orig.x * 0.05 + time) * 2;
        const wave2 = Math.cos(orig.z * 0.08 - time * 1.5) * 2;
        const wave3 = Math.sin((orig.x + orig.z) * 0.03 + time * 0.8) * 3;
        
        // Slight interaction based on mouse center
        const distToCenter = Math.sqrt(orig.x * orig.x + orig.z * orig.z);
        const interaction = Math.sin(distToCenter * 0.05 - time * 2) * (mouseX * 5);

        posAttribute.setY(i, orig.y + wave1 + wave2 + wave3 + interaction);
      }
      
      // Need to compute vertex normals so the light reflects correctly on the deformed surface
      geometry.computeVertexNormals();
      posAttribute.needsUpdate = true;

      renderer.render(scene, camera);
    };

    animate();

    // Entrance Animation
    gsap.from(plane.position, {
      y: -20,
      duration: 3,
      ease: 'power3.out'
    });

    // Cleanup
    return () => {
      window.removeEventListener('resize', onWindowResize);
      document.removeEventListener('mousemove', onDocumentMouseMove);
      cancelAnimationFrame(animationFrameId);
      currentMount.removeChild(renderer.domElement);
      
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div 
      ref={mountRef} 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: -1, 
        pointerEvents: 'none', 
        background: '#050608' // Match fog color
      }}
    />
  );
}
