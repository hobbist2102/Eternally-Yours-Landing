// Enhanced Background.js - Luxury WebGL Gold Shimmer/Dust Effect with Parallax (Fine Dust Version)
// Created for eternallyyoursrsvp.in

document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    initWebGLBackground();
    initLoadingSequence();
  }, 500);
});

function initLoadingSequence() {
  const loadingScreen = document.querySelector('.loading-screen');
  const loadingBarFill = document.querySelector('.loading-bar-fill');
  const loadingPercentage = document.querySelector('.loading-percentage');
  const contentWrapper = document.querySelector('.content-wrapper');
  let progress = 0;
  const loadingInterval = setInterval(() => {
    progress += Math.random() * 10;
    if (progress > 100) progress = 100;
    loadingBarFill.style.width = `${progress}%`;
    loadingPercentage.textContent = `${Math.floor(progress)}%`;
    if (progress === 100) {
      clearInterval(loadingInterval);
      setTimeout(() => {
        loadingScreen.style.opacity = '0';
        contentWrapper.style.opacity = '1';
        setTimeout(() => {
          loadingScreen.style.display = 'none';
          initAnimations();
        }, 1000);
      }, 500);
    }
  }, 100);
}

function initWebGLBackground() {
  const canvas = document.getElementById('webgl-background');
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
    alpha: true
  });
  renderer.setClearColor(0x000000, 0); // transparent background
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  camera.position.z = 30;

  // Finer, more delicate gold dust
  const shimmerSystem = createGoldShimmerSystem();
  scene.add(shimmerSystem);

  function createGoldShimmerSystem() {
    const group = new THREE.Group();
    // Both layers are fine and gold-only
    const shimmerLayers = [
      { count: 3500, sizeRange: [0.02, 0.045], color: 0xffd700, opacity: 0.7, distance: 55, speed: 0.00012 },
      { count: 2200, sizeRange: [0.015, 0.035], color: 0xd4af37, opacity: 0.5, distance: 80, speed: 0.00008 }
    ];
    shimmerLayers.forEach(layer => {
      const shimmerParticles = createShimmerLayer(layer);
      group.add(shimmerParticles);
    });
    return group;
  }

  function createShimmerLayer(layer) {
    const texture = createShimmerTexture(layer.color);
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

    const particleCount = layer.count;
    const positions = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    const speeds = new Float32Array(particleCount);
    const offsets = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.random() * layer.distance;
      const height = (Math.random() - 0.5) * layer.distance * 1.5;
      const cluster = Math.floor(Math.random() * 8);
      let offsetX = 0, offsetY = 0;
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
      const x = radius * Math.cos(angle) + offsetX * (0.5 + Math.random() * 0.5);
      const y = height + offsetY * (0.5 + Math.random() * 0.5);
      const z = radius * Math.sin(angle) * 0.5;
      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;
      sizes[i] = Math.random() * (layer.sizeRange[1] - layer.sizeRange[0]) + layer.sizeRange[0];
      speeds[i] = 0.2 + Math.random() * 0.8;
      offsets[i] = Math.random() * Math.PI * 2;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    const particles = new THREE.Points(geometry, material);
    particles.userData = {
      speeds: speeds,
      offsets: offsets,
      initialPositions: positions.slice(),
      layer: layer
    };
    return particles;
  }

  function createShimmerTexture(color = 0xffd700, size = 64, softness = 0.9) {
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    const gradient = ctx.createRadialGradient(
      size / 2, size / 2, 0,
      size / 2, size / 2, size / 2
    );
    const r = (color >> 16) & 255;
    const g = (color >> 8) & 255;
    const b = color & 255;
    gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, 1)`);
    gradient.addColorStop(softness * 0.3, `rgba(${r}, ${g}, ${b}, 0.8)`);
    gradient.addColorStop(softness * 0.7, `rgba(${r}, ${g}, ${b}, 0.3)`);
    gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);
    if (Math.random() > 0.7) {
      ctx.globalCompositeOperation = 'lighten';
      const sparkleGradient = ctx.createRadialGradient(
        size / 2, size / 2, 0,
        size / 2, size / 2, size / 4
      );
      sparkleGradient.addColorStop(0, 'rgba(255, 255, 255, 0.7)');
      sparkleGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = sparkleGradient;
      ctx.fillRect(0, 0, size, size);
    }
    const texture = new THREE.Texture(canvas);
    texture.needsUpdate = true;
    return texture;
  }

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  let mouseX = 0;
  let mouseY = 0;
  let targetX = 0;
  let targetY = 0;
  window.addEventListener('mousemove', (event) => {
    mouseX = (event.clientX - window.innerWidth / 2);
    mouseY = (event.clientY - window.innerHeight / 2);
  });

  let scrollY = 0;
  let targetScrollY = 0;
  window.addEventListener('scroll', () => {
    targetScrollY = window.scrollY;
  });

  function animate() {
    requestAnimationFrame(animate);
    const time = Date.now() * 0.001;
    targetX = mouseX * 0.001;
    targetY = mouseY * 0.001;
    scrollY += (targetScrollY - scrollY) * 0.05;

    shimmerSystem.children.forEach((particles, layerIndex) => {
      const positions = particles.geometry.attributes.position.array;
      const initialPositions = particles.userData.initialPositions;
      const speeds = particles.userData.speeds;
      const offsets = particles.userData.offsets;
      const layer = particles.userData.layer;
      for (let i = 0; i < positions.length / 3; i++) {
        const ix = initialPositions[i * 3];
        const iy = initialPositions[i * 3 + 1];
        const iz = initialPositions[i * 3 + 2];
        const speed = speeds[i];
        const offset = offsets[i];
        const flowX = Math.sin(time * speed + offset) * 0.5;
        const flowY = Math.sin(time * speed * 0.5 + offset) * 0.3;
        const flowZ = Math.cos(time * speed * 0.7 + offset) * 0.2;
        positions[i * 3] = ix + flowX;
        positions[i * 3 + 1] = iy + flowY;
        positions[i * 3 + 2] = iz + flowZ;
      }
      particles.geometry.attributes.position.needsUpdate = true;
      particles.rotation.y += layer.speed * 0.5;
      particles.rotation.x += layer.speed * 0.3;
      const parallaxY = scrollY * 0.0003 * (layerIndex + 1) / shimmerSystem.children.length;
      particles.position.y = -parallaxY * layer.distance * 0.2;
      const mouseEffect = 0.0001 * (layerIndex + 1);
      particles.rotation.y += targetX * mouseEffect;
      particles.rotation.x += targetY * mouseEffect;
    });

    renderer.render(scene, camera);
  }

  animate();
}
