// Enhanced Background.js - Luxury WebGL Starlit Sky Background with Nebula Effects and Parallax
// Created for eternallyyoursrsvp.in

// Initialize Three.js scene when document is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Wait for loading screen to complete
  setTimeout(() => {
    initWebGLBackground();
    initLoadingSequence();
  }, 500);
});

// Loading sequence animation
function initLoadingSequence() {
  const loadingScreen = document.querySelector('.loading-screen');
  const loadingBarFill = document.querySelector('.loading-bar-fill');
  const loadingPercentage = document.querySelector('.loading-percentage');
  const contentWrapper = document.querySelector('.content-wrapper');
  
  // Simulate loading progress
  let progress = 0;
  const loadingInterval = setInterval(() => {
    progress += Math.random() * 10;
    if (progress > 100) progress = 100;
    
    loadingBarFill.style.width = `${progress}%`;
    loadingPercentage.textContent = `${Math.floor(progress)}%`;
    
    if (progress === 100) {
      clearInterval(loadingInterval);
      
      // Fade out loading screen
      setTimeout(() => {
        loadingScreen.style.opacity = '0';
        contentWrapper.style.opacity = '1';
        
        // Remove loading screen after animation completes
        setTimeout(() => {
          loadingScreen.style.display = 'none';
          
          // Initialize animations after loading
          initAnimations();
        }, 1000);
      }, 500);
    }
  }, 100);
}

// Initialize WebGL background with Three.js
function initWebGLBackground() {
  // Get canvas element
  const canvas = document.getElementById('webgl-background');
  
  // Create scene, camera, and renderer
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
    alpha: true
  });
  
  // Set renderer size and pixel ratio
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Limit pixel ratio for performance
  
  // Position camera
  camera.position.z = 30;
  
  // Create circular texture for stars instead of square pixels
  const starTexture = createCircularTexture();
  
  // Create multiple star layers for parallax effect
  const starLayers = [
    { count: 2000, size: [0.1, 0.3], color: 0xffffff, distance: 100, speed: 0.00005 },
    { count: 1500, size: [0.2, 0.5], color: 0xf8f8ff, distance: 80, speed: 0.0001 },
    { count: 1000, size: [0.3, 0.7], color: 0xfffaf0, distance: 60, speed: 0.00015 },
    { count: 500, size: [0.4, 0.9], color: 0xffd700, distance: 40, speed: 0.0002 }
  ];
  
  const starGroups = starLayers.map(layer => createStarLayer(layer, starTexture));
  starGroups.forEach(group => scene.add(group));
  
  // Create nebula effects
  const nebulaLayers = [
    { count: 2000, size: [0.3, 0.8], color: 0xd4af37, opacity: 0.3, distance: 50, speed: 0.0002 },
    { count: 1500, size: [0.4, 1.0], color: 0x9932cc, opacity: 0.2, distance: 60, speed: 0.00015 },
    { count: 1000, size: [0.5, 1.2], color: 0x800080, opacity: 0.15, distance: 70, speed: 0.0001 }
  ];
  
  const nebulaGroups = nebulaLayers.map(layer => createNebulaLayer(layer, starTexture));
  nebulaGroups.forEach(group => scene.add(group));
  
  // Create shooting stars system
  const shootingStarSystem = createShootingStarSystem();
  scene.add(shootingStarSystem);
  
  // Create function to generate circular texture for particles
  function createCircularTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    
    // Create radial gradient for soft-edged circle
    const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
    gradient.addColorStop(0.3, 'rgba(255, 255, 255, 0.8)');
    gradient.addColorStop(0.7, 'rgba(255, 255, 255, 0.3)');
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 64, 64);
    
    const texture = new THREE.Texture(canvas);
    texture.needsUpdate = true;
    return texture;
  }
  
  // Create star layer with custom parameters
  function createStarLayer(layer, texture) {
    const geometry = new THREE.BufferGeometry();
    const material = new THREE.PointsMaterial({
      color: layer.color,
      size: layer.size[1],
      map: texture,
      transparent: true,
      opacity: 0.8,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });
    
    const positions = new Float32Array(layer.count * 3);
    const sizes = new Float32Array(layer.count);
    
    for (let i = 0; i < layer.count; i++) {
      // Create stars in a dome shape for more realistic sky
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI * 0.65;
      const distance = layer.distance;
      
      positions[i * 3] = distance * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = distance * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = distance * Math.cos(phi);
      
      // Random size within range
      sizes[i] = Math.random() * (layer.size[1] - layer.size[0]) + layer.size[0];
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    
    const stars = new THREE.Points(geometry, material);
    stars.userData = { speed: layer.speed, distance: layer.distance };
    
    return stars;
  }
  
  // Create nebula layer with custom parameters
  function createNebulaLayer(layer, texture) {
    const geometry = new THREE.BufferGeometry();
    const material = new THREE.PointsMaterial({
      color: layer.color,
      size: layer.size[1],
      map: texture,
      transparent: true,
      opacity: layer.opacity,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });
    
    const positions = new Float32Array(layer.count * 3);
    const sizes = new Float32Array(layer.count);
    
    // Create nebula cloud formations
    for (let i = 0; i < layer.count; i++) {
      // Create cloud-like clusters
      const cluster = Math.floor(Math.random() * 5);
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      const distance = layer.distance * (0.8 + Math.random() * 0.4);
      
      // Base position
      let x = distance * Math.sin(phi) * Math.cos(theta);
      let y = distance * Math.sin(phi) * Math.sin(theta);
      let z = distance * Math.cos(phi);
      
      // Add cluster offset
      switch (cluster) {
        case 0: // Upper right
          x += 20;
          y += 15;
          break;
        case 1: // Lower left
          x -= 25;
          y -= 10;
          break;
        case 2: // Center
          x += 5;
          y -= 5;
          break;
        case 3: // Upper left
          x -= 15;
          y += 20;
          break;
        case 4: // Lower right
          x += 10;
          y -= 25;
          break;
      }
      
      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;
      
      // Random size within range
      sizes[i] = Math.random() * (layer.size[1] - layer.size[0]) + layer.size[0];
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    
    const nebula = new THREE.Points(geometry, material);
    nebula.userData = { speed: layer.speed, distance: layer.distance };
    
    return nebula;
  }
  
  // Create shooting star system
  function createShootingStarSystem() {
    const group = new THREE.Group();
    const shootingStars = [];
    
    // Function to create a single shooting star
    function createShootingStar() {
      if (Math.random() > 0.995) { // Rare occurrence
        // Create a line geometry for the shooting star
        const startPoint = new THREE.Vector3(
          (Math.random() - 0.5) * 100,
          (Math.random() * 50) + 10, // Start from upper part of the sky
          (Math.random() - 0.5) * 100
        );
        
        // Direction is always downward with some randomness
        const endPoint = new THREE.Vector3(
          startPoint.x + (Math.random() - 0.5) * 40,
          startPoint.y - (Math.random() * 60 + 20),
          startPoint.z
        );
        
        const shootingStarGeometry = new THREE.BufferGeometry().setFromPoints([
          startPoint,
          endPoint
        ]);
        
        // Create a glowing line material
        const shootingStarMaterial = new THREE.LineBasicMaterial({
          color: 0xffffff,
          transparent: true,
          opacity: 0,
          blending: THREE.AdditiveBlending
        });
        
        const shootingStar = new THREE.Line(shootingStarGeometry, shootingStarMaterial);
        
        // Add to scene
        group.add(shootingStar);
        
        // Animate the shooting star
        const duration = Math.random() * 1000 + 500;
        const startTime = Date.now();
        
        shootingStars.push({
          object: shootingStar,
          startTime: startTime,
          duration: duration
        });
      }
    }
    
    // Update function for shooting stars
    group.update = function() {
      createShootingStar();
      
      const currentTime = Date.now();
      
      // Update existing shooting stars
      for (let i = shootingStars.length - 1; i >= 0; i--) {
        const star = shootingStars[i];
        const elapsed = currentTime - star.startTime;
        const progress = Math.min(elapsed / star.duration, 1);
        
        if (progress < 0.2) {
          // Fade in
          star.object.material.opacity = progress * 5;
        } else if (progress > 0.8) {
          // Fade out
          star.object.material.opacity = (1 - progress) * 5;
        } else {
          // Full opacity
          star.object.material.opacity = 1;
        }
        
        if (progress >= 1) {
          // Remove completed shooting star
          group.remove(star.object);
          star.object.geometry.dispose();
          star.object.material.dispose();
          shootingStars.splice(i, 1);
        }
      }
    };
    
    return group;
  }
  
  // Handle window resize
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
  
  // Track mouse movement for interactive background
  let mouseX = 0;
  let mouseY = 0;
  let targetX = 0;
  let targetY = 0;
  
  window.addEventListener('mousemove', (event) => {
    mouseX = (event.clientX - window.innerWidth / 2);
    mouseY = (event.clientY - window.innerHeight / 2);
  });
  
  // Track scroll position for parallax effect
  let scrollY = 0;
  let targetScrollY = 0;
  
  window.addEventListener('scroll', () => {
    targetScrollY = window.scrollY;
  });
  
  // Animation loop
  function animate() {
    requestAnimationFrame(animate);
    
    // Smooth mouse movement
    targetX = mouseX * 0.001;
    targetY = mouseY * 0.001;
    
    // Smooth scroll movement
    scrollY += (targetScrollY - scrollY) * 0.05;
    
    // Update star layers with different speeds for parallax
    starGroups.forEach((stars, index) => {
      // Rotate based on mouse position (interactive)
      stars.rotation.y += (targetX - stars.rotation.y) * 0.01 * stars.userData.speed * 20;
      stars.rotation.x += (targetY - stars.rotation.x) * 0.01 * stars.userData.speed * 20;
      
      // Constant slow rotation for ambient movement
      stars.rotation.y += stars.userData.speed;
      stars.rotation.x += stars.userData.speed * 0.5;
      
      // Parallax effect based on scroll position
      const parallaxY = scrollY * 0.0005 * (index + 1) / starGroups.length;
      stars.position.y = -parallaxY * stars.userData.distance * 0.1;
    });
    
    // Update nebula layers
    nebulaGroups.forEach((nebula, index) => {
      // Slower rotation for nebulas
      nebula.rotation.y += nebula.userData.speed * 0.5;
      nebula.rotation.z += nebula.userData.speed * 0.3;
      
      // Subtle pulsing effect
      const time = Date.now() * 0.0005;
      const pulseFactor = Math.sin(time + index) * 0.05 + 1;
      nebula.material.opacity = nebula.material.userData?.baseOpacity || 0.3 * pulseFactor;
      
      // Parallax effect based on scroll position (opposite direction to stars)
      const parallaxY = scrollY * 0.0003 * (index + 1) / nebulaGroups.length;
      nebula.position.y = parallaxY * nebula.userData.distance * 0.05;
    });
    
    // Update shooting stars
    shootingStarSystem.update();
    
    renderer.render(scene, camera);
  }
  
  // Start animation loop
  animate();
}

// Helper function to create a glowing particle texture
function createGlowTexture(color = 0xffffff, size = 64) {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  
  // Create radial gradient
  const gradient = ctx.createRadialGradient(
    size/2, size/2, 0,
    size/2, size/2, size/2
  );
  
  // Convert hex color to RGB
  const r = (color >> 16) & 255;
  const g = (color >> 8) & 255;
  const b = color & 255;
  
  gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, 1)`);
  gradient.addColorStop(0.3, `rgba(${r}, ${g}, ${b}, 0.8)`);
  gradient.addColorStop(0.7, `rgba(${r}, ${g}, ${b}, 0.3)`);
  gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);
  
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);
  
  const texture = new THREE.Texture(canvas);
  texture.needsUpdate = true;
  return texture;
}
