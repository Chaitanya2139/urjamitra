import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import './Globe.css';

const Globe: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    
    renderer.setSize(400, 400);
    renderer.setClearColor(0x000000, 0);
    currentMount.appendChild(renderer.domElement);

    // Create globe
    const geometry = new THREE.SphereGeometry(2, 32, 32);
    const material = new THREE.MeshPhongMaterial({
      color: 0x4CAF50,
      transparent: true,
      opacity: 0.8,
      shininess: 100
    });
    const globe = new THREE.Mesh(geometry, material);
    scene.add(globe);

    // Add energy points
    const energyPoints: THREE.Mesh[] = [];
    for (let i = 0; i < 50; i++) {
      const pointGeometry = new THREE.SphereGeometry(0.05, 8, 8);
      const pointMaterial = new THREE.MeshBasicMaterial({ color: 0xFFFF00 });
      const point = new THREE.Mesh(pointGeometry, pointMaterial);
      
      // Random position on sphere surface
      const phi = Math.acos(2 * Math.random() - 1);
      const theta = 2 * Math.PI * Math.random();
      point.position.setFromSphericalCoords(2.1, phi, theta);
      
      scene.add(point);
      energyPoints.push(point);
    }

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    // Camera position
    camera.position.z = 5;

    // Animation
    const animate = () => {
      requestAnimationFrame(animate);
      
      globe.rotation.y += 0.005;
      globe.rotation.x += 0.002;
      
      // Animate energy points
      energyPoints.forEach((point, index) => {
        point.scale.setScalar(1 + Math.sin(Date.now() * 0.001 + index) * 0.3);
      });
      
      renderer.render(scene, camera);
    };
    animate();

    // Cleanup
    return () => {
      if (currentMount && currentMount.contains(renderer.domElement)) {
        currentMount.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return <div ref={mountRef} className="globe-container" />;
};

export default Globe;
