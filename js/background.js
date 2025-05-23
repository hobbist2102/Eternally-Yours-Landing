// Background.js - WebGL Starlit Sky Background with Nebula Effects
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
  renderer.setPixelRatio(window.devicePixelRatio);
  
  // Position camera
  camera.position.z = 30;
  
  // Create stars
  const starsGeometry = new THREE.BufferGeometry();
  const starsMaterial = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.1,
    transparent: true
  });
  
  // Generate random star positions
  const starsCount = 5000;
  const starsPositions = new Float32Array(starsCount * 3);
  const starsSizes = new Float32Array(starsCount);
  
  for (let i = 0; i < starsCount; i++) {
    const i3 = i * 3;
    starsPositions[i3] = (Math.random() - 0.5) * 100;
    starsPositions[i3 + 1] = (Math.random() - 0.5) * 100;
    starsPositions[i3 + 2] = (Math.random() - 0.5) * 100;
    
    starsSizes[i] = Math.random() * 0.5 + 0.1;
  }
  
  starsGeometry.setAttribute('position', new THREE.BufferAttribute(starsPositions, 3));
  starsGeometry.setAttribute('size', new THREE.BufferAttribute(starsSizes, 1));
  
  const stars = new THREE.Points(starsGeometry, starsMaterial);
  scene.add(stars);
  
  // Create nebula effect
  const nebulaGeometry = new THREE.BufferGeometry();
  const nebulaMaterial = new THREE.PointsMaterial({
    color: 0xd4af37,
    size: 0.2,
    transparent: true,
    opacity: 0.4,
    blending: THREE.AdditiveBlending
  });
  
  // Generate nebula cloud
  const nebulaCount = 2000;
  const nebulaPositions = new Float32Array(nebulaCount * 3);
  const nebulaSizes = new Float32Array(nebulaCount);
  
  for (let i = 0; i < nebulaCount; i++) {
    const i3 = i * 3;
    const theta = Math.random() * Math.PI * 2;
    const radius = Math.random() * 20 + 10;
    
    nebulaPositions[i3] = Math.cos(theta) * radius + (Math.random() - 0.5) * 10;
    nebulaPositions[i3 + 1] = Math.sin(theta) * radius + (Math.random() - 0.5) * 10;
    nebulaPositions[i3 + 2] = (Math.random() - 0.5) * 10;
    
    nebulaSizes[i] = Math.random() * 0.8 + 0.2;
  }
  
  nebulaGeometry.setAttribute('position', new THREE.BufferAttribute(nebulaPositions, 3));
  nebulaGeometry.setAttribute('size', new THREE.BufferAttribute(nebulaSizes, 1));
  
  const nebula = new THREE.Points(nebulaGeometry, nebulaMaterial);
  scene.add(nebula);
  
  // Create purple nebula
  const purpleNebulaGeometry = new THREE.BufferGeometry();
  const purpleNebulaMaterial = new THREE.PointsMaterial({
    color: 0x9932cc,
    size: 0.2,
    transparent: true,
    opacity: 0.3,
    blending: THREE.AdditiveBlending
  });
  
  // Generate purple nebula cloud
  const purpleNebulaCount = 1500;
  const purpleNebulaPositions = new Float32Array(purpleNebulaCount * 3);
  const purpleNebulaSizes = new Float32Array(purpleNebulaCount);
  
  for (let i = 0; i < purpleNebulaCount; i++) {
    const i3 = i * 3;
    const theta = Math.random() * Math.PI * 2;
    const radius = Math.random() * 25 + 5;
    
    purpleNebulaPositions[i3] = Math.cos(theta) * radius + (Math.random() - 0.5) * 15;
    purpleNebulaPositions[i3 + 1] = Math.sin(theta) * radius + (Math.random() - 0.5) * 15;
    purpleNebulaPositions[i3 + 2] = (Math.random() - 0.5) * 15;
    
    purpleNebulaSizes[i] = Math.random() * 0.8 + 0.2;
  }
  
  purpleNebulaGeometry.setAttribute('position', new THREE.BufferAttribute(purpleNebulaPositions, 3));
  purpleNebulaGeometry.setAttribute('size', new THREE.BufferAttribute(purpleNebulaSizes, 1));
  
  const purpleNebula = new THREE.Points(purpleNebulaGeometry, purpleNebulaMaterial);
  scene.add(purpleNebula);
  
  // Create shooting stars
  const shootingStars = [];
  const shootingStarMaterial = new THREE.LineBasicMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.8
  });
  
  function createShootingStar() {
    // Create random start and end points
    const startPoint = new THREE.Vector3(
      (Math.random() - 0.5) * 100,
      (Math.random() - 0.5) * 100,
      (Math.random() - 0.5) * 100
    );
    
    const direction = new THREE.Vector3(
      (Math.random() - 0.5) * 2,
      (Math.random() - 0.5) * 2,
      (Math.random() - 0.5) * 2
    ).normalize();
    
    const endPoint = new THREE.Vector3().copy(startPoint).add(
      direction.multiplyScalar(Math.random() * 20 + 10)
    );
    
    const shootingStarGeometry = new THREE.BufferGeometry().setFromPoints([
      startPoint,
      endPoint
    ]);
    
    const shootingStar = new THREE.Line(shootingStarGeometry, shootingStarMaterial.clone());
    shootingStar.material.opacity = 0;
    shootingStar.userData = {
      startTime: Date.now() + Math.random() * 10000, // Random delay
      duration: Math.random() * 1000 + 500, // Random duration
      active: false
    };
    
    scene.add(shootingStar);
    shootingStars.push(shootingStar);
  }
  
  // Create initial shooting stars
  for (let i = 0; i < 10; i++) {
    createShootingStar();
  }
  
  // Handle window resize
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
  
  // Animation loop
  function animate() {
    requestAnimationFrame(animate);
    
    // Rotate stars slowly
    stars.rotation.y += 0.0001;
    stars.rotation.x += 0.00005;
    
    // Rotate nebulas
    nebula.rotation.y += 0.0002;
    nebula.rotation.z += 0.0001;
    
    purpleNebula.rotation.y -= 0.0001;
    purpleNebula.rotation.z -= 0.00015;
    
    // Update shooting stars
    const currentTime = Date.now();
    shootingStars.forEach((star, index) => {
      const userData = star.userData;
      
      if (!userData.active && currentTime > userData.startTime) {
        userData.active = true;
        userData.startTime = currentTime;
      }
      
      if (userData.active) {
        const elapsed = currentTime - userData.startTime;
        const progress = Math.min(elapsed / userData.duration, 1);
        
        if (progress < 0.2) {
          // Fade in
          star.material.opacity = progress * 5;
        } else if (progress > 0.8) {
          // Fade out
          star.material.opacity = (1 - progress) * 5;
        } else {
          // Full opacity
          star.material.opacity = 1;
        }
        
        if (progress === 1) {
          // Reset shooting star
          scene.remove(star);
          shootingStars.splice(index, 1);
          createShootingStar();
        }
      }
    });
    
    // Mouse interaction - subtle movement based on mouse position
    if (window.mouseX !== undefined && window.mouseY !== undefined) {
      const targetX = (window.mouseX - window.innerWidth / 2) * 0.0005;
      const targetY = (window.mouseY - window.innerHeight / 2) * 0.0005;
      
      camera.rotation.x += (targetY - camera.rotation.x) * 0.05;
      camera.rotation.y += (targetX - camera.rotation.y) * 0.05;
    }
    
    renderer.render(scene, camera);
  }
  
  // Track mouse movement
  window.addEventListener('mousemove', (event) => {
    window.mouseX = event.clientX;
    window.mouseY = event.clientY;
  });
  
  // Start animation loop
  animate();
}
