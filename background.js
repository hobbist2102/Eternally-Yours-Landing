// Background.js - WebGL Starlit Sky with Nebula Effects
// This script creates an immersive, romantic starlit sky background with subtle nebula effects
// and shooting stars using Three.js

class StarryBackground {
  constructor() {
    this.canvas = document.getElementById('webgl-background');
    this.scene = new THREE.Scene();
    this.camera = null;
    this.renderer = null;
    this.stars = [];
    this.shootingStars = [];
    this.nebulaClouds = [];
    this.clock = new THREE.Clock();
    this.mouse = new THREE.Vector2(0, 0);
    this.targetMouse = new THREE.Vector2(0, 0);
    this.mouseVelocity = new THREE.Vector2(0, 0);
    this.lastMousePosition = new THREE.Vector2(0, 0);
    this.initialized = false;
    
    // Configuration
    this.config = {
      starCount: 1500,
      starSize: { min: 0.1, max: 0.5 },
      starColor: { 
        primary: new THREE.Color(0xffffff),
        secondary: new THREE.Color(0xd1c4e9)
      },
      nebulaCount: 5,
      nebulaSize: { min: 100, max: 300 },
      nebulaOpacity: { min: 0.05, max: 0.15 },
      nebulaColors: [
        new THREE.Color(0x9c75cf), // Purple
        new THREE.Color(0x7e57b2), // Deeper Purple
        new THREE.Color(0xd19c29), // Gold
        new THREE.Color(0xe0b454)  // Light Gold
      ],
      shootingStarFrequency: 0.01, // Chance per frame
      parallaxStrength: 0.05,
      cameraDistance: 1000
    };
    
    this.init();
  }
  
  init() {
    if (!this.canvas) return;
    
    // Setup renderer
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: true
    });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setClearColor(0x2d1a45, 1);
    
    // Setup camera
    const fov = 60;
    const aspect = window.innerWidth / window.innerHeight;
    const near = 0.1;
    const far = 10000;
    this.camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    this.camera.position.z = this.config.cameraDistance;
    
    // Create stars
    this.createStars();
    
    // Create nebula clouds
    this.createNebulaClouds();
    
    // Event listeners
    window.addEventListener('resize', this.onResize.bind(this));
    window.addEventListener('mousemove', this.onMouseMove.bind(this));
    
    // Start animation
    this.animate();
    this.initialized = true;
  }
  
  createStars() {
    const geometry = new THREE.BufferGeometry();
    const vertices = [];
    const sizes = [];
    const colors = [];
    const opacities = [];
    const twinkleFactors = [];
    
    for (let i = 0; i < this.config.starCount; i++) {
      // Position
      const x = (Math.random() - 0.5) * 2000;
      const y = (Math.random() - 0.5) * 2000;
      const z = -Math.random() * 2000;
      vertices.push(x, y, z);
      
      // Size
      const size = THREE.MathUtils.randFloat(
        this.config.starSize.min,
        this.config.starSize.max
      );
      sizes.push(size);
      
      // Color
      const color = new THREE.Color().lerpColors(
        this.config.starColor.primary,
        this.config.starColor.secondary,
        Math.random()
      );
      colors.push(color.r, color.g, color.b);
      
      // Opacity
      opacities.push(Math.random() * 0.5 + 0.5);
      
      // Twinkle factor
      twinkleFactors.push(Math.random() * 2);
    }
    
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    geometry.setAttribute('size', new THREE.Float32BufferAttribute(sizes, 1));
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    geometry.setAttribute('opacity', new THREE.Float32BufferAttribute(opacities, 1));
    geometry.setAttribute('twinkleFactor', new THREE.Float32BufferAttribute(twinkleFactors, 1));
    
    // Star shader material
    const material = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        pixelRatio: { value: Math.min(window.devicePixelRatio, 2) }
      },
      vertexShader: `
        attribute float size;
        attribute vec3 color;
        attribute float opacity;
        attribute float twinkleFactor;
        uniform float time;
        uniform float pixelRatio;
        varying vec3 vColor;
        varying float vOpacity;
        
        void main() {
          vColor = color;
          
          // Twinkle effect
          float twinkle = sin(time * twinkleFactor) * 0.5 + 0.5;
          vOpacity = opacity * (0.7 + 0.3 * twinkle);
          
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = size * pixelRatio * (300.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        varying float vOpacity;
        
        void main() {
          // Circular point
          float distance = length(gl_PointCoord - vec2(0.5));
          if (distance > 0.5) discard;
          
          // Soft edge
          float smoothness = 0.05;
          float alpha = smoothstep(0.5, 0.5 - smoothness, distance);
          
          // Glow effect
          float glow = exp(-distance * 8.0);
          vec3 finalColor = vColor * (1.0 + glow * 0.5);
          
          gl_FragColor = vec4(finalColor, vOpacity * alpha);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });
    
    const stars = new THREE.Points(geometry, material);
    this.scene.add(stars);
    this.stars = stars;
  }
  
  createNebulaClouds() {
    for (let i = 0; i < this.config.nebulaCount; i++) {
      // Create a nebula cloud
      const size = THREE.MathUtils.randFloat(
        this.config.nebulaSize.min,
        this.config.nebulaSize.max
      );
      
      const geometry = new THREE.PlaneGeometry(size, size);
      
      // Select random colors from the palette
      const colorIndex1 = Math.floor(Math.random() * this.config.nebulaColors.length);
      let colorIndex2 = Math.floor(Math.random() * this.config.nebulaColors.length);
      while (colorIndex2 === colorIndex1) {
        colorIndex2 = Math.floor(Math.random() * this.config.nebulaColors.length);
      }
      
      const color1 = this.config.nebulaColors[colorIndex1];
      const color2 = this.config.nebulaColors[colorIndex2];
      
      const material = new THREE.ShaderMaterial({
        uniforms: {
          time: { value: 0 },
          color1: { value: new THREE.Vector3(color1.r, color1.g, color1.b) },
          color2: { value: new THREE.Vector3(color2.r, color2.g, color2.b) },
          opacity: { value: THREE.MathUtils.randFloat(
            this.config.nebulaOpacity.min,
            this.config.nebulaOpacity.max
          )}
        },
        vertexShader: `
          varying vec2 vUv;
          
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          uniform float time;
          uniform vec3 color1;
          uniform vec3 color2;
          uniform float opacity;
          varying vec2 vUv;
          
          // Simplex noise function
          vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
          vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
          vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }
          
          float snoise(vec2 v) {
            const vec4 C = vec4(0.211324865405187,  // (3.0-sqrt(3.0))/6.0
                                0.366025403784439,  // 0.5*(sqrt(3.0)-1.0)
                               -0.577350269189626,  // -1.0 + 2.0 * C.x
                                0.024390243902439); // 1.0 / 41.0
            vec2 i  = floor(v + dot(v, C.yy));
            vec2 x0 = v -   i + dot(i, C.xx);
            vec2 i1;
            i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
            vec4 x12 = x0.xyxy + C.xxzz;
            x12.xy -= i1;
            i = mod289(i);
            vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
                  + i.x + vec3(0.0, i1.x, 1.0 ));
            vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
            m = m*m;
            m = m*m;
            vec3 x = 2.0 * fract(p * C.www) - 1.0;
            vec3 h = abs(x) - 0.5;
            vec3 ox = floor(x + 0.5);
            vec3 a0 = x - ox;
            m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
            vec3 g;
            g.x  = a0.x  * x0.x  + h.x  * x0.y;
            g.yz = a0.yz * x12.xz + h.yz * x12.yw;
            return 130.0 * dot(m, g);
          }
          
          void main() {
            // Center-based distance
            vec2 center = vUv - 0.5;
            float dist = length(center);
            
            // Create multiple layers of noise
            float scale1 = 3.0;
            float scale2 = 6.0;
            float scale3 = 12.0;
            
            float offset = time * 0.05;
            
            float noise1 = snoise(vUv * scale1 + offset);
            float noise2 = snoise(vUv * scale2 - offset * 0.7);
            float noise3 = snoise(vUv * scale3 + offset * 0.3);
            
            // Combine noise layers
            float noise = (noise1 * 0.5 + noise2 * 0.3 + noise3 * 0.2);
            
            // Create cloud-like shape with soft edges
            float edge = smoothstep(0.8, 0.2, dist);
            float alpha = noise * edge * opacity;
            
            // Mix colors based on noise
            float colorMix = (noise + 1.0) * 0.5;
            vec3 finalColor = mix(color1, color2, colorMix);
            
            gl_FragColor = vec4(finalColor, alpha);
          }
        `,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending
      });
      
      const nebula = new THREE.Mesh(geometry, material);
      
      // Position randomly in 3D space
      nebula.position.x = (Math.random() - 0.5) * 1500;
      nebula.position.y = (Math.random() - 0.5) * 1500;
      nebula.position.z = -Math.random() * 1000 - 500;
      
      // Random rotation
      nebula.rotation.z = Math.random() * Math.PI * 2;
      
      this.scene.add(nebula);
      this.nebulaClouds.push(nebula);
    }
  }
  
  createShootingStar() {
    // Create a shooting star
    const length = Math.random() * 100 + 50;
    const geometry = new THREE.BufferGeometry();
    
    // Create a trail of points
    const points = [];
    const trailSegments = 20;
    
    for (let i = 0; i < trailSegments; i++) {
      const t = i / (trailSegments - 1);
      points.push(new THREE.Vector3(-t * length, 0, 0));
    }
    
    geometry.setFromPoints(points);
    
    // Create attributes for size and opacity
    const sizes = new Float32Array(trailSegments);
    const opacities = new Float32Array(trailSegments);
    
    for (let i = 0; i < trailSegments; i++) {
      const t = i / (trailSegments - 1);
      sizes[i] = (1 - t) * 3;
      opacities[i] = (1 - t) * (1 - t);
    }
    
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    geometry.setAttribute('opacity', new THREE.BufferAttribute(opacities, 1));
    
    // Shader material for the shooting star
    const material = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        pixelRatio: { value: Math.min(window.devicePixelRatio, 2) }
      },
      vertexShader: `
        attribute float size;
        attribute float opacity;
        uniform float pixelRatio;
        varying float vOpacity;
        
        void main() {
          vOpacity = opacity;
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = size * pixelRatio * (300.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        varying float vOpacity;
        
        void main() {
          float distance = length(gl_PointCoord - vec2(0.5));
          if (distance > 0.5) discard;
          
          float alpha = smoothstep(0.5, 0.0, distance) * vOpacity;
          vec3 color = vec3(1.0, 0.95, 0.8); // Slightly warm white
          
          gl_FragColor = vec4(color, alpha);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });
    
    const shootingStar = new THREE.Points(geometry, material);
    
    // Position and direction
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.random() * Math.PI / 3 + Math.PI / 3; // Angle from vertical
    
    shootingStar.position.x = Math.random() * 2000 - 1000;
    shootingStar.position.y = Math.random() * 1000 + 500;
    shootingStar.position.z = -Math.random() * 1000 - 200;
    
    // Rotate to point in a random direction (downward)
    shootingStar.rotation.z = theta;
    shootingStar.rotation.y = phi;
    
    // Speed
    const speed = Math.random() * 300 + 200;
    
    // Add to scene and store
    this.scene.add(shootingStar);
    this.shootingStars.push({
      mesh: shootingStar,
      speed: speed,
      direction: new THREE.Vector3(
        Math.sin(phi) * Math.cos(theta),
        -Math.cos(phi),
        Math.sin(phi) * Math.sin(theta)
      ).normalize(),
      timeAlive: 0,
      lifetime: Math.random() * 2 + 1 // 1-3 seconds
    });
  }
  
  updateShootingStars(deltaTime) {
    // Chance to create a new shooting star
    if (Math.random() < this.config.shootingStarFrequency) {
      this.createShootingStar();
    }
    
    // Update existing shooting stars
    for (let i = this.shootingStars.length - 1; i >= 0; i--) {
      const star = this.shootingStars[i];
      star.timeAlive += deltaTime;
      
      // Move the shooting star
      star.mesh.position.addScaledVector(star.direction, star.speed * deltaTime);
      
      // Remove if it's lived its lifetime
      if (star.timeAlive > star.lifetime) {
        this.scene.remove(star.mesh);
        this.shootingStars.splice(i, 1);
      }
    }
  }
  
  onResize() {
    if (!this.renderer || !this.camera) return;
    
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    
    // Update star sizes
    if (this.stars && this.stars.material) {
      this.stars.material.uniforms.pixelRatio.value = Math.min(window.devicePixelRatio, 2);
    }
  }
  
  onMouseMove(event) {
    // Calculate normalized device coordinates
    this.targetMouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.targetMouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  }
  
  updateMousePosition() {
    // Smooth mouse movement
    this.mouse.x += (this.targetMouse.x - this.mouse.x) * 0.05;
    this.mouse.y += (this.targetMouse.y - this.mouse.y) * 0.05;
    
    // Calculate mouse velocity
    this.mouseVelocity.x = this.mouse.x - this.lastMousePosition.x;
    this.mouseVelocity.y = this.mouse.y - this.lastMousePosition.y;
    
    // Store last position
    this.lastMousePosition.x = this.mouse.x;
    this.lastMousePosition.y = this.mouse.y;
  }
  
  updateParallax() {
    if (!this.camera) return;
    
    // Apply parallax effect to camera
    const targetX = this.mouse.x * this.config.parallaxStrength * 10;
    const targetY = this.mouse.y * this.config.parallaxStrength * 10;
    
    this.camera.position.x += (targetX - this.camera.position.x) * 0.05;
    this.camera.position.y += (targetY - this.camera.position.y) * 0.05;
    
    // Always look at center
    this.camera.lookAt(0, 0, 0);
  }
  
  animate() {
    requestAnimationFrame(this.animate.bind(this));
    
    const deltaTime = this.clock.getDelta();
    const elapsedTime = this.clock.getElapsedTime();
    
    // Update mouse position with smoothing
    this.updateMousePosition();
    
    // Update parallax effect
    this.updateParallax();
    
    // Update star twinkle
    if (this.stars && this.stars.material) {
      this.stars.material.uniforms.time.value = elapsedTime;
    }
    
    // Update nebula clouds
    for (const nebula of this.nebulaClouds) {
      nebula.material.uniforms.time.value = elapsedTime;
      
      // Subtle rotation
      nebula.rotation.z += deltaTime * 0.02;
    }
    
    // Update shooting stars
    this.updateShootingStars(deltaTime);
    
    // Render
    if (this.renderer && this.scene && this.camera) {
      this.renderer.render(this.scene, this.camera);
    }
  }
}

// Initialize when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Wait for Three.js to be loaded
  if (typeof THREE !== 'undefined') {
    window.starryBackground = new StarryBackground();
  } else {
    console.error('Three.js not loaded');
  }
});
