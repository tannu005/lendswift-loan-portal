import { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * ThreeBackground Component
 * Renders an immersive, high-performance WebGL 3D interactive particle field.
 * Reacts dynamically to mouse coordinates with a smooth parallax camera tilt.
 */
export default function ThreeBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    // Track mouse coordinates
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };

    // 1. Scene setup
    const scene = new THREE.Scene();

    // 2. Camera setup
    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 35;

    // 3. Renderer setup
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      alpha: true, // Translucent background
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // 4. Create particle groups (Amethyst Violet & Emerald Mint)
    const particleCount = 200;
    const boxSize = 60;

    // Helper to generate particle geometry
    const createParticleGeometry = (count) => {
      const geometry = new THREE.BufferGeometry();
      const positions = new Float32Array(count * 3);
      const velocities = new Float32Array(count * 3);

      for (let i = 0; i < count; i++) {
        // Random positions inside a bounding box
        positions[i * 3] = (Math.random() - 0.5) * boxSize;
        positions[i * 3 + 1] = (Math.random() - 0.5) * boxSize;
        positions[i * 3 + 2] = (Math.random() - 0.5) * boxSize;

        // Micro-drifting velocities
        velocities[i * 3] = (Math.random() - 0.5) * 0.02;
        velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.02;
        velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.02;
      }

      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      return { geometry, velocities };
    };

    // Amethyst Particles (Violet #8B5CF6)
    const amethystData = createParticleGeometry(particleCount);
    const amethystMaterial = new THREE.PointsMaterial({
      size: 0.35,
      color: 0x8B5CF6,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const amethystPoints = new THREE.Points(amethystData.geometry, amethystMaterial);
    scene.add(amethystPoints);

    // Emerald Particles (Green #10B981)
    const emeraldData = createParticleGeometry(particleCount);
    const emeraldMaterial = new THREE.PointsMaterial({
      size: 0.28,
      color: 0x10B981,
      transparent: true,
      opacity: 0.55,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const emeraldPoints = new THREE.Points(emeraldData.geometry, emeraldMaterial);
    scene.add(emeraldPoints);

    // Subtle background ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    // Track mouse move event
    const handleMouseMove = (event) => {
      // Normalize mouse coordinates (-1 to 1)
      mouse.targetX = (event.clientX / window.innerWidth - 0.5) * 2;
      mouse.targetY = -(event.clientY / window.innerHeight - 0.5) * 2;
    };

    // Window resize event
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('resize', handleResize);

    // 5. Animation loop
    let animationFrameId;
    
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      // Smooth mouse coordinate interpolation (lerp)
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      // Camera parallax tilt based on mouse position
      camera.position.x += (mouse.x * 12 - camera.position.x) * 0.03;
      camera.position.y += (mouse.y * 12 - camera.position.y) * 0.03;
      camera.lookAt(scene.position);

      // Auto-rotation of particle clouds
      amethystPoints.rotation.y += 0.0006;
      amethystPoints.rotation.x += 0.0002;
      
      emeraldPoints.rotation.y -= 0.0004;
      emeraldPoints.rotation.z += 0.0003;

      // Animate drifting positions inside geometry buffers
      const driftParticles = (points, velocities) => {
        const positions = points.geometry.attributes.position.array;
        const count = positions.length / 3;
        
        for (let i = 0; i < count; i++) {
          positions[i * 3] += velocities[i * 3];
          positions[i * 3 + 1] += velocities[i * 3 + 1];
          positions[i * 3 + 2] += velocities[i * 3 + 2];

          // Wrap around if particles go out of box bounds
          if (Math.abs(positions[i * 3]) > boxSize / 2) velocities[i * 3] *= -1;
          if (Math.abs(positions[i * 3 + 1]) > boxSize / 2) velocities[i * 3 + 1] *= -1;
          if (Math.abs(positions[i * 3 + 2]) > boxSize / 2) velocities[i * 3 + 2] *= -1;
        }
        points.geometry.attributes.position.needsUpdate = true;
      };

      driftParticles(amethystPoints, amethystData.velocities);
      driftParticles(emeraldPoints, emeraldData.velocities);

      renderer.render(scene, camera);
    };

    animate();

    // 6. Component Clean-up
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      
      // Memory cleanup
      amethystData.geometry.dispose();
      amethystMaterial.dispose();
      emeraldData.geometry.dispose();
      emeraldMaterial.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full -z-10 pointer-events-none"
      style={{ display: 'block' }}
    />
  );
}
