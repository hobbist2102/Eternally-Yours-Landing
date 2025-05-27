// Enhanced Background.js - Luxury WebGL Gold Shimmer/Dust Effect with Parallax
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
  
  // Create gold shimmer/dust effect
  const shimmerSystem = createGoldShimmerSystem();
  scene.add(shimmerSystem);
  
  // Create subtle nebula effects for depth
  const nebulaSystem = createNebulaSystem();
  scene.add(nebulaSystem);
  
  // Create occasional shooting stars
  const shootingStarSystem = createShootingStarSystem();
  scene.add(shootingStarSystem);
  
  // Create gold shimmer/dust system
  function createGoldShimmerSystem() {
    const group = new THREE.Group();
    
    // Create multiple shimmer layers for depth and richness
    const shimmerLayers = [
      { count: 3000, sizeRange: [0.05, 0.15], color: 0xffd700, opacity: 0.7, distance: 50, speed: 0.00015 },
      { count: 2500, sizeRange: [0.03, 0.12], color: 0xf5deb3, opacity: 0.6, distance: 70, speed: 0.0001 },
      { count: 2000, sizeRange: [0.02, 0.08], color: 0xd4af37, opacity: 0.5, distance: 90, speed: 0.00005 }
    ];
    
    // Create shimmer particles with custom textures
    shimmerLayers.forEach(layer => {
      const shimmerParticles = createShimmerLayer(layer);
      group.add(shimmerParticles);
    });
    
    return group;
  }
  
  // Create a single shimmer layer
  function createShimmerLayer(layer) {
    // Create soft, glowing particle texture
    const texture = createShimmerTexture(layer.color);
    
    // Create geometry for particles
    const geometry = new THREE.BufferGeometry();
    const material = new THREE.PointsMaterial({
      color: layer.color,
      size: layer.sizeRange[1],
      map: texture,
      transparent: true,
      opacity: layer.opacity,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });
    
    // Create particles with flowing pattern
    const particleCount = layer.count;
    const positions = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    const speeds = new Float32Array(particleCount);
    const offsets = new Float32Array(particleCount);
    
    for (let i = 0; i < particleCount; i++) {
      // Create flowing pattern with clusters
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.random() * layer.distance;
      const height = (Math.random() - 0.5) * layer.distance * 1.5;
      
      // Position with slight clustering for dust-like appearance
      const cluster = Math.floor(Math.random() * 8);
      let offsetX = 0, offsetY = 0;
      
      // Create natural clustering pattern
      switch (cluster) {
        case 0: offsetX = 10; offsetY = 15; break;
        case 1: offsetX = -15; offsetY = 10; break;
        case 2: offsetX = 5; offsetY = -15; break;
        case 3: offsetX = -10; offsetY = -10; break;
        case 4: offsetX = 20; offsetY = 0; break;
        case 5: offsetX = -20; offsetY = 5; break;
        case 6: offsetX = 0; offsetY = 20; break;
        case 7: offsetX = -5; offsetY = -20; break;
      }
      
      // Apply cluster offset with randomness for natural look
      const x = radius * Math.cos(angle) + offsetX * (0.5 + Math.random() * 0.5);
      const y = height + offsetY * (0.5 + Math.random() * 0.5);
      const z = radius * Math.sin(angle) * 0.5;
      
      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;
      
      // Varied sizes for more natural shimmer effect
      sizes[i] = Math.random() * (layer.sizeRange[1] - layer.sizeRange[0]) + layer.sizeRange[0];
      
      // Random movement speeds and animation offsets
      speeds[i] = 0.2 + Math.random() * 0.8;
      offsets[i] = Math.random() * Math.PI * 2;
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    
    const particles = new THREE.Points(geometry, material);
    
    // Store animation data for update function
    particles.userData = {
      speeds: speeds,
      offsets: offsets,
      initialPositions: positions.slice(),
      layer: layer
    };
    
    return particles;
  }
  
  // Create nebula system for depth and atmosphere
  function createNebulaSystem() {
    const group = new THREE.Group();
    
    // Create subtle nebula clouds
    const nebulaLayers = [
      { count: 800, size: 1.2, color: 0xd4af37, opacity: 0.15, distance: 80 },
      { count: 600, size: 1.5, color: 0x800080, opacity: 0.1, distance: 100 }
    ];
    
    nebulaLayers.forEach(layer => {
      const nebula = createNebulaCloud(layer);
      group.add(nebula);
    });
    
    return group;
  }
  
  // Create a single nebula cloud
  function createNebulaCloud(layer) {
    const texture = createShimmerTexture(layer.color, 128, 0.8);
    
    const geometry = new THREE.BufferGeometry();
    const material = new THREE.PointsMaterial({
      color: layer.color,
      size: layer.size,
      map: texture,
      transparent: true,
      opacity: layer.opacity,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });
    
    const positions = new Float32Array(layer.count * 3);
    
    // Create cloud-like formations
    for (let i = 0; i < layer.count; i++) {
      // Create flowing, cloud-like pattern
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      const r = layer.distance * (0.7 + Math.random() * 0.3);
      
      // Base position with cluster pattern
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = (Math.random() - 0.5) * layer.distance * 0.5;
      const z = r * Math.sin(phi) * Math.sin(theta) * 0.5;
      
      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    
    const nebula = new THREE.Points(geometry, material);
    nebula.userData = { speed: 0.0001, rotationAxis: new THREE.Vector3(0, 1, 0.5).normalize() };
    
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
        
        // Create points for trail effect
        const points = [];
        const segments = 10;
        for (let i = 0; i <= segments; i++) {
          const point = new THREE.Vector3().lerpVectors(startPoint, endPoint, i / segments);
          points.push(point);
        }
        
        const shootingStarGeometry = new THREE.BufferGeometry().setFromPoints(points);
        
        // Create a glowing line material with gold tint
        const shootingStarMaterial = new THREE.LineBasicMaterial({
          color: 0xfffacd, // Light gold/yellow
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
  
  // Create shimmer texture for gold dust effect
  function createShimmerTexture(color = 0xffd700, size = 64, softness = 0.9) {
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    
    // Create radial gradient for soft-edged particles
    const gradient = ctx.createRadialGradient(
      size/2, size/2, 0,
      size/2, size/2, size/2
    );
    
    // Convert hex color to RGB
    const r = (color >> 16) & 255;
    const g = (color >> 8) & 255;
    const b = color & 255;
    
    // Create soft gradient for shimmer effect
    gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, 1)`);
    gradient.addColorStop(softness * 0.3, `rgba(${r}, ${g}, ${b}, 0.8)`);
    gradient.addColorStop(softness * 0.7, `rgba(${r}, ${g}, ${b}, 0.3)`);
    gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);
    
    // Add subtle sparkle effect
    if (Math.random() > 0.7) {
      ctx.globalCompositeOperation = 'lighten';
      const sparkleGradient = ctx.createRadialGradient(
        size/2, size/2, 0,
        size/2, size/2, size/4
      );
      sparkleGradient.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
      sparkleGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = sparkleGradient;
      ctx.fillRect(0, 0, size, size);
    }
    
    const texture = new THREE.Texture(canvas);
    texture.needsUpdate = true;
    return texture;
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
    
    // Current time for animations
    const time = Date.now() * 0.001;
    
    // Smooth mouse movement
    targetX = mouseX * 0.001;
    targetY = mouseY * 0.001;
    
    // Smooth scroll movement
    scrollY += (targetScrollY - scrollY) * 0.05;
    
    // Update shimmer particles
    shimmerSystem.children.forEach((particles, layerIndex) => {
      const positions = particles.geometry.attributes.position.array;
      const initialPositions = particles.userData.initialPositions;
      const speeds = particles.userData.speeds;
      const offsets = particles.userData.offsets;
      const layer = particles.userData.layer;
      
      // Update each particle
      for (let i = 0; i < positions.length / 3; i++) {
        // Get initial position
        const ix = initialPositions[i * 3];
        const iy = initialPositions[i * 3 + 1];
        const iz = initialPositions[i * 3 + 2];
        
        // Calculate flowing movement
        const speed = speeds[i];
        const offset = offsets[i];
        
        // Gentle flowing motion in a figure-8 pattern
        const flowX = Math.sin(time * speed + offset) * 0.5;
        const flowY = Math.sin(time * speed * 0.5 + offset) * 0.3;
        const flowZ = Math.cos(time * speed * 0.7 + offset) * 0.2;
        
        // Apply flowing motion
        positions[i * 3] = ix + flowX;
        positions[i * 3 + 1] = iy + flowY;
        positions[i * 3 + 2] = iz + flowZ;
      }
      
      // Update geometry
      particles.geometry.attributes.position.needsUpdate = true;
      
      // Subtle rotation for overall shimmer effect
      particles.rotation.y += layer.speed * 0.5;
      particles.rotation.x += layer.speed * 0.3;
      
      // Parallax effect based on scroll position
      const parallaxY = scrollY * 0.0003 * (layerIndex + 1) / shimmerSystem.children.length;
      particles.position.y = -parallaxY * layer.distance * 0.2;
      
      // Interactive movement based on mouse position
      const mouseEffect = 0.0001 * (layerIndex + 1);
      particles.rotation.y += targetX * mouseEffect;
      particles.rotation.x += targetY * mouseEffect;
    });
    
    // Update nebula clouds
    nebulaSystem.children.forEach((nebula, index) => {
      // Slow rotation around custom axis
      nebula.rotateOnAxis(nebula.userData.rotationAxis, nebula.userData.speed);
      
      // Subtle pulsing effect
      const pulseFactor = Math.sin(time * 0.5 + index) * 0.05 + 1;
      nebula.material.opacity = nebula.material.userData?.baseOpacity || nebula.material.opacity * pulseFactor;
      
      // Parallax effect based on scroll position (opposite direction to shimmer)
      const parallaxY = scrollY * 0.0002 * (index + 1) / nebulaSystem.children.length;
      nebula.position.y = parallaxY * 10;
    });
    
    // Update shooting stars
    shootingStarSystem.update();
    
    renderer.render(scene, camera);
  }
  
  // Start animation loop
  animate();
}
