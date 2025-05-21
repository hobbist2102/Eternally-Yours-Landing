// Main JavaScript for animations and interactions

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize modules
    initCustomCursor();
    initScrollProgress();
    initStarlitSky();
    initNavigation();
    initHeroAnimations();
    initScrollAnimations();
    init3DCards();
    initTestimonialSlider();
    initTransportMap();
    initMagneticButtons();
    initSmoothScrolling();
});

// Custom cursor implementation with refined interactions
function initCustomCursor() {
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');
    
    if (!cursorDot || !cursorOutline) return;
    
    let cursorVisible = true;
    let cursorEnlarged = false;
    
    // Set cursor initial position off screen to avoid flash
    gsap.set([cursorDot, cursorOutline], {
        x: -100,
        y: -100,
        xPercent: -50,
        yPercent: -50
    });
    
    // Mouse move event
    document.addEventListener('mousemove', (e) => {
        if (cursorVisible) {
            // Dot follows cursor exactly
            gsap.to(cursorDot, {
                duration: 0.1,
                x: e.clientX,
                y: e.clientY
            });
            
            // Outline follows with slight delay for elegant effect
            gsap.to(cursorOutline, {
                duration: 0.5,
                x: e.clientX,
                y: e.clientY,
                ease: "power3.out"
            });
        }
    });
    
    // Mouse events for interactive elements
    const interactiveElements = document.querySelectorAll('a, button, .feature-card, .communication-card, .transport-feature, .testimonial-dot, .social-link');
    
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursorEnlarged = true;
            
            // Different effects for different element types
            if (el.classList.contains('btn-primary')) {
                gsap.to(cursorOutline, {
                    scale: 1.5,
                    borderColor: 'var(--color-gold-600)',
                    backgroundColor: 'rgba(201, 176, 55, 0.1)',
                    duration: 0.3
                });
            } else if (el.classList.contains('feature-card') || el.classList.contains('communication-card')) {
                gsap.to(cursorOutline, {
                    scale: 1.2,
                    borderColor: 'var(--color-gold-600)',
                    backgroundColor: 'rgba(201, 176, 55, 0.05)',
                    duration: 0.3
                });
            } else {
                gsap.to(cursorOutline, {
                    scale: 1.5,
                    borderColor: 'var(--color-gold-600)',
                    duration: 0.3
                });
            }
            
            gsap.to(cursorDot, {
                scale: 1.5,
                duration: 0.3
            });
        });
        
        el.addEventListener('mouseleave', () => {
            cursorEnlarged = false;
            gsap.to([cursorOutline, cursorDot], {
                scale: 1,
                borderColor: 'var(--color-gold-600)',
                backgroundColor: 'transparent',
                duration: 0.3
            });
        });
    });
    
    // Hide/show cursor based on document visibility
    document.addEventListener('mouseenter', () => {
        cursorVisible = true;
        gsap.to([cursorDot, cursorOutline], {
            opacity: 1,
            duration: 0.3
        });
    });
    
    document.addEventListener('mouseleave', () => {
        cursorVisible = false;
        gsap.to([cursorDot, cursorOutline], {
            opacity: 0,
            duration: 0.3
        });
    });
    
    // Hide default cursor
    document.body.style.cursor = 'none';
    
    // Show default cursor on touch devices
    if ('ontouchstart' in window) {
        document.body.style.cursor = 'auto';
        [cursorDot, cursorOutline].forEach(el => {
            if (el) el.style.display = 'none';
        });
    }
}

// Scroll progress indicator
function initScrollProgress() {
    const progressBar = document.querySelector('.progress-bar');
    
    if (!progressBar) return;
    
    gsap.to(progressBar, {
        width: "100%",
        ease: "none",
        scrollTrigger: { 
            trigger: document.body,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.3
        }
    });
}

// Starlit sky background with Three.js - enhanced for romance and luxury
function initStarlitSky() {
    const container = document.getElementById('starlit-sky');
    if (!container) return;
    
    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 200;
    
    const renderer = new THREE.WebGLRenderer({ 
        alpha: true,
        antialias: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);
    
    // Create stars with depth variation
    function createStarField(count, size, color, depth) {
        const geometry = new THREE.BufferGeometry();
        const material = new THREE.PointsMaterial({
            color: color,
            size: size,
            transparent: true,
            opacity: 0.8,
            depthWrite: false
        });
        
        const vertices = [];
        
        for (let i = 0; i < count; i++) {
            // Create stars in a dome shape above the viewer
            const theta = THREE.MathUtils.randFloatSpread(360); 
            const phi = THREE.MathUtils.randFloatSpread(90) - 45;
            
            const x = depth * Math.sin(theta * Math.PI / 180) * Math.cos(phi * Math.PI / 180);
            const y = depth * Math.sin(phi * Math.PI / 180);
            const z = depth * Math.cos(theta * Math.PI / 180) * Math.cos(phi * Math.PI / 180);
            
            vertices.push(x, y, z);
        }
        
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
        return new THREE.Points(geometry, material);
    }
    
    // Create multiple star layers for depth
    const starLayers = [
        { count: 1000, size: 0.5, color: 0xffffff, depth: 300 },
        { count: 500, size: 0.7, color: 0xffffff, depth: 250 },
        { count: 200, size: 1.0, color: 0xE0D48B, depth: 200 },
        { count: 100, size: 1.2, color: 0xC9B037, depth: 150 }
    ];
    
    const stars = starLayers.map(layer => {
        const starField = createStarField(layer.count, layer.size, layer.color, layer.depth);
        scene.add(starField);
        return starField;
    });
    
    // Create nebula-like clouds for romantic atmosphere
    function createNebula() {
        const geometry = new THREE.BufferGeometry();
        const material = new THREE.PointsMaterial({
            color: 0x5E35B1,
            size: 2,
            transparent: true,
            opacity: 0.3,
            blending: THREE.AdditiveBlending
        });
        
        const vertices = [];
        const particleCount = 300;
        
        for (let i = 0; i < particleCount; i++) {
            // Create a cloud-like formation
            const angle = Math.random() * Math.PI * 2;
            const radius = 50 + Math.random() * 50;
            const x = Math.cos(angle) * radius;
            const y = (Math.random() - 0.5) * 100;
            const z = Math.sin(angle) * radius;
            
            vertices.push(x, y, z);
        }
        
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
        return new THREE.Points(geometry, material);
    }
    
    const nebula = createNebula();
    scene.add(nebula);
    
    // Create occasional shooting stars
    function createShootingStar() {
        // Only create shooting stars occasionally
        if (Math.random() > 0.995) {
            const geometry = new THREE.BufferGeometry();
            
            // Create a line for the shooting star
            const lineMaterial = new THREE.LineBasicMaterial({ 
                color: 0xffffff,
                transparent: true,
                opacity: 1
            });
            
            // Random position at the top of the view
            const startX = THREE.MathUtils.randFloatSpread(400);
            const startY = 100 + THREE.MathUtils.randFloat(0, 100);
            const startZ = THREE.MathUtils.randFloatSpread(200);
            
            // Direction of travel (always downward)
            const endX = startX + THREE.MathUtils.randFloatSpread(100);
            const endY = startY - THREE.MathUtils.randFloat(150, 300);
            const endZ = startZ;
            
            const points = [];
            points.push(new THREE.Vector3(startX, startY, startZ));
            points.push(new THREE.Vector3(endX, endY, endZ));
            
            geometry.setFromPoints(points);
            
            const shootingStar = new THREE.Line(geometry, lineMaterial);
            scene.add(shootingStar);
            
            // Animate the shooting star
            gsap.to(shootingStar.material, {
                opacity: 0,
                duration: 1,
                ease: "power1.in",
                onComplete: () => {
                    scene.remove(shootingStar);
                    shootingStar.geometry.dispose();
                    shootingStar.material.dispose();
                }
            });
        }
    }
    
    // Handle window resize
    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }
    
    window.addEventListener('resize', onWindowResize);
    
    // Animation loop
    function animate() {
        requestAnimationFrame(animate);
        
        // Rotate star layers at different speeds for parallax effect
        stars.forEach((starField, index) => {
            starField.rotation.y += 0.0001 * (index + 1);
            starField.rotation.x += 0.00005 * (index + 1);
        });
        
        // Slowly rotate nebula
        nebula.rotation.y += 0.0002;
        nebula.rotation.z += 0.0001;
        
        // Create shooting stars
        createShootingStar();
        
        renderer.render(scene, camera);
    }
    
    animate();
}

// Navigation interactions
function initNavigation() {
    const navbar = document.querySelector('.navbar');
    const menuToggle = document.createElement('div');
    menuToggle.classList.add('menu-toggle');
    
    // Create menu toggle for mobile
    for (let i = 0; i < 3; i++) {
        const span = document.createElement('span');
        menuToggle.appendChild(span);
    }
    
    navbar.appendChild(menuToggle);
    
    const navLinks = navbar.querySelector('.nav-links');
    
    // Scroll effect for navbar
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    
    // Mobile menu toggle
    menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('active');
        navLinks.classList.toggle('active');
        
        if (navLinks.classList.contains('active')) {
            gsap.fromTo(navLinks, 
                { clipPath: 'circle(0% at top right)' },
                { clipPath: 'circle(150% at top right)', duration: 0.5, ease: "power3.inOut" }
            );
            
            // Animate each link
            gsap.fromTo(navLinks.querySelectorAll('a'), 
                { y: 20, opacity: 0 },
                { y: 0, opacity: 1, stagger: 0.1, duration: 0.3, delay: 0.2 }
            );
        }
    });
    
    // Close menu when clicking a link
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            menuToggle.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });
    
    // Add styles for mobile menu
    if (!document.getElementById('mobile-menu-styles')) {
        const style = document.createElement('style');
        style.id = 'mobile-menu-styles';
        style.textContent = `
            @media (max-width: 768px) {
                .nav-links {
                    position: fixed;
                    top: 0;
                    right: 0;
                    width: 100%;
                    height: 100vh;
                    background: rgba(10, 0, 20, 0.95);
                    backdrop-filter: blur(10px);
                    -webkit-backdrop-filter: blur(10px);
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    gap: 2rem;
                    clip-path: circle(0% at top right);
                    opacity: 0;
                    pointer-events: none;
                    transition: all 0.5s cubic-bezier(0.19, 1, 0.22, 1);
                }
                
                .nav-links.active {
                    opacity: 1;
                    pointer-events: all;
                }
                
                .menu-toggle {
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    width: 30px;
                    height: 21px;
                    cursor: pointer;
                    z-index: 1000;
                }
                
                .menu-toggle span {
                    display: block;
                    height: 2px;
                    width: 100%;
                    background-color: var(--color-gold-600);
                    transition: all 0.3s cubic-bezier(0.19, 1, 0.22, 1);
                }
                
                .menu-toggle.active span:nth-child(1) {
                    transform: translateY(9px) rotate(45deg);
                }
                
                .menu-toggle.active span:nth-child(2) {
                    opacity: 0;
                }
                
                .menu-toggle.active span:nth-child(3) {
                    transform: translateY(-9px) rotate(-45deg);
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// Hero section animations
function initHeroAnimations() {
    const heroTitle = document.querySelector('.hero-title');
    const heroSubtitle = document.querySelector('.hero-subtitle');
    const heroCta = document.querySelector('.hero-cta');
    const scrollIndicator = document.querySelector('.scroll-indicator');
    
    if (!heroTitle || !heroSubtitle || !heroCta) return;
    
    // Create a timeline for hero animations
    const heroTimeline = gsap.timeline({ defaults: { ease: "power3.out" } });
    
    heroTimeline
        .to(heroTitle, { 
            opacity: 1, 
            y: 0, 
            duration: 1.5, 
            delay: 0.5 
        })
        .to(heroSubtitle, { 
            opacity: 1, 
            y: 0, 
            duration: 1.5 
        }, "-=1.2")
        .to(heroCta, { 
            opacity: 1, 
            y: 0, 
            duration: 1.5 
        }, "-=1.2")
        .to(scrollIndicator, { 
            opacity: 1, 
            duration: 1 
        }, "-=0.8");
    
    // Subtle floating animation for hero content
    gsap.to(heroTitle, {
        y: -10,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut"
    });
}

// Scroll-triggered animations
function initScrollAnimations() {
    gsap.registerPlugin(ScrollTrigger);
    
    // Animate section headers
    gsap.utils.toArray('.section').forEach(section => {
        const heading = section.querySelector('h2');
        const subheading = section.querySelector('.micro');
        const content = section.querySelector('p.lead');
        
        if (heading && subheading) {
            gsap.fromTo([subheading, heading, content], 
                { y: 50, opacity: 0 },
                { 
                    y: 0, 
                    opacity: 1, 
                    duration: 1,
                    stagger: 0.2,
                    scrollTrigger: {
                        trigger: section,
                        start: "top 80%",
                        toggleActions: "play none none none"
                    }
                }
            );
        }
    });
    
    // Animate intro section
    const introContent = document.querySelector('.intro-content');
    const introImage = document.querySelector('.intro-image');
    
    if (introContent && introImage) {
        gsap.fromTo(introContent, 
            { x: -50, opacity: 0 },
            { 
                x: 0, 
                opacity: 1, 
                duration: 1,
                scrollTrigger: {
                    trigger: '.intro-container',
                    start: "top 80%",
                    toggleActions: "play none none none"
                }
            }
        );
        
        gsap.fromTo(introImage, 
            { x: 50, opacity: 0 },
            { 
                x: 0, 
                opacity: 1, 
                duration: 1,
                scrollTrigger: {
                    trigger: '.intro-container',
                    start: "top 80%",
                    toggleActions: "play none none none"
                }
            }
        );
    }
    
    // Animate feature cards with staggered reveal
    gsap.utils.toArray('.feature-card').forEach((card, i) => {
        gsap.fromTo(card, 
            { y: 50, opacity: 0 },
            { 
                y: 0, 
                opacity: 1, 
                duration: 0.8,
                delay: i * 0.2,
                scrollTrigger: {
                    trigger: '.feature-grid',
                    start: "top 80%",
                    toggleActions: "play none none none"
                }
            }
        );
    });
    
    // Animate transport section
    const transportVisual = document.querySelector('.transport-visual');
    const transportFeatures = document.querySelector('.transport-features');
    
    if (transportVisual && transportFeatures) {
        gsap.fromTo(transportVisual, 
            { x: -50, opacity: 0 },
            { 
                x: 0, 
                opacity: 1, 
                duration: 1,
                scrollTrigger: {
                    trigger: '.transport-content',
                    start: "top 80%",
                    toggleActions: "play none none none"
                }
            }
        );
        
        gsap.fromTo(transportFeatures, 
            { x: 50, opacity: 0 },
            { 
                x: 0, 
                opacity: 1, 
                duration: 1,
                scrollTrigger: {
                    trigger: '.transport-content',
                    start: "top 80%",
                    toggleActions: "play none none none"
                }
            }
        );
        
        // Staggered animation for transport features
        gsap.utils.toArray('.transport-feature').forEach((feature, i) => {
            gsap.fromTo(feature, 
                { x: 50, opacity: 0 },
                { 
                    x: 0, 
                    opacity: 1, 
                    duration: 0.8,
                    delay: i * 0.2,
                    scrollTrigger: {
                        trigger: '.transport-features',
                        start: "top 80%",
                        toggleActions: "play none none none"
                    }
                }
            );
        });
    }
    
    // Animate communication cards with staggered reveal
    gsap.utils.toArray('.communication-card').forEach((card, i) => {
        gsap.fromTo(card, 
            { y: 50, opacity: 0 },
            { 
                y: 0, 
                opacity: 1, 
                duration: 0.8,
                delay: i * 0.2,
                scrollTrigger: {
                    trigger: '.communication-grid',
                    start: "top 80%",
                    toggleActions: "play none none none"
                }
            }
        );
    });
    
    // Animate communication demo
    const communicationDemo = document.querySelector('.communication-demo');
    if (communicationDemo) {
        gsap.fromTo(communicationDemo, 
            { y: 50, opacity: 0 },
            { 
                y: 0, 
                opacity: 1, 
                duration: 1,
                scrollTrigger: {
                    trigger: communicationDemo,
                    start: "top 80%",
                    toggleActions: "play none none none"
                }
            }
        );
        
        // Staggered animation for chat messages
        gsap.utils.toArray('.chat-message').forEach((message, i) => {
            gsap.fromTo(message, 
                { y: 20, opacity: 0 },
                { 
                    y: 0, 
                    opacity: 1, 
                    duration: 0.5,
                    delay: 0.5 + (i * 0.3),
                    scrollTrigger: {
                        trigger: communicationDemo,
                        start: "top 80%",
                        toggleActions: "play none none none"
                    }
                }
            );
        });
    }
    
    // Animate testimonial card
    const testimonialCard = document.querySelector('.testimonial-card');
    if (testimonialCard) {
        gsap.fromTo(testimonialCard, 
            { y: 50, opacity: 0 },
            { 
                y: 0, 
                opacity: 1, 
                duration: 1,
                scrollTrigger: {
                    trigger: '.testimonial-slider',
                    start: "top 80%",
                    toggleActions: "play none none none"
                }
            }
        );
    }
    
    // Animate CTA section
    const ctaContainer = document.querySelector('.cta-container');
    if (ctaContainer) {
        gsap.fromTo(ctaContainer, 
            { y: 50, opacity: 0 },
            { 
                y: 0, 
                opacity: 1, 
                duration: 1,
                scrollTrigger: {
                    trigger: '.cta',
                    start: "top 80%",
                    toggleActions: "play none none none"
                }
            }
        );
    }
}

// 3D card tilt effect with refined interactions
function init3DCards() {
    const cards = document.querySelectorAll('.feature-card, .communication-card, .testimonial-card, .intro-card');
    
    cards.forEach(card => {
        // Variables for tracking mouse position
        let bounds;
        let mouseX;
        let mouseY;
        
        const mouseEnter = () => {
            bounds = card.getBoundingClientRect();
            document.addEventListener('mousemove', mouseMove);
        };
        
        const mouseMove = (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            
            const mouseXRelative = mouseX - bounds.left;
            const mouseYRelative = mouseY - bounds.top;
            const centerX = bounds.width / 2;
            const centerY = bounds.height / 2;
            
            const percentX = (mouseXRelative - centerX) / centerX;
            const percentY = -((mouseYRelative - centerY) / centerY);
            
            // More subtle rotation for elegance
            const rotateX = percentY * 10;
            const rotateY = percentX * 10;
            
            // Apply transform with smooth transition
            gsap.to(card, {
                rotateX: rotateX,
                rotateY: rotateY,
                transformPerspective: 1000,
                transformOrigin: "center center",
                ease: "power2.out",
                duration: 0.5
            });
            
            // Add subtle shadow movement
            const shadowX = -percentX * 10;
            const shadowY = -percentY * 10;
            gsap.to(card, {
                boxShadow: `${shadowX}px ${shadowY}px 30px rgba(0,0,0,0.2)`,
                duration: 0.5
            });
            
            // Add subtle scale for hover effect
            gsap.to(card, {
                scale: 1.02,
                duration: 0.5
            });
        };
        
        const mouseLeave = () => {
            document.removeEventListener('mousemove', mouseMove);
            
            // Reset card position with smooth transition
            gsap.to(card, {
                rotateX: 0,
                rotateY: 0,
                scale: 1,
                boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                duration: 0.7,
                ease: "elastic.out(1, 0.5)"
            });
        };
        
        // Add event listeners
        card.addEventListener('mouseenter', mouseEnter);
        card.addEventListener('mouseleave', mouseLeave);
    });
}

// Testimonial slider with refined animations
function initTestimonialSlider() {
    const testimonials = [
        {
            quote: "Eternally Yours transformed our wedding planning from chaos to poetry. Every detail was perfect, every moment treasured.",
            author: "Priya & Arjun",
            location: "Delhi"
        },
        {
            quote: "The transportation system alone saved us countless headaches. Our families arrived together, relaxed and ready to celebrate.",
            author: "Meera & Raj",
            location: "Mumbai"
        },
        {
            quote: "The elegant communication tools made our guests feel valued and informed. The AI assistant answered questions we hadn't even thought of!",
            author: "Anita & Vikram",
            location: "Bangalore"
        }
    ];
    
    const testimonialCard = document.querySelector('.testimonial-card');
    const dots = document.querySelectorAll('.testimonial-dot');
    
    if (!testimonialCard || !dots.length) return;
    
    let currentIndex = 0;
    
    // Set up click handlers for dots
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            if (currentIndex === index) return;
            currentIndex = index;
            updateTestimonial();
        });
    });
    
    function updateTestimonial() {
        // Update active dot with animation
        dots.forEach((dot, index) => {
            if (index === currentIndex) {
                gsap.to(dot, {
                    backgroundColor: 'var(--color-gold-600)',
                    scale: 1.2,
                    duration: 0.3
                });
            } else {
                gsap.to(dot, {
                    backgroundColor: 'rgba(255, 255, 255, 0.3)',
                    scale: 1,
                    duration: 0.3
                });
            }
        });
        
        // Animate out current testimonial
        gsap.to(testimonialCard, {
            y: -20,
            opacity: 0,
            duration: 0.5,
            ease: "power2.in",
            onComplete: () => {
                // Update content
                const testimonial = testimonials[currentIndex];
                const quoteElement = testimonialCard.querySelector('.testimonial-quote');
                const authorNameElement = testimonialCard.querySelector('.testimonial-author h4');
                const authorLocationElement = testimonialCard.querySelector('.testimonial-author p');
                
                if (quoteElement) quoteElement.textContent = testimonial.quote;
                if (authorNameElement) authorNameElement.textContent = testimonial.author;
                if (authorLocationElement) authorLocationElement.textContent = testimonial.location;
                
                // Animate in new testimonial
                gsap.to(testimonialCard, {
                    y: 0,
                    opacity: 1,
                    duration: 0.7,
                    ease: "power2.out"
                });
            }
        });
    }
    
    // Auto-rotate testimonials
    let testimonialInterval = setInterval(() => {
        currentIndex = (currentIndex + 1) % testimonials.length;
        updateTestimonial();
    }, 6000);
    
    // Pause rotation on hover
    testimonialCard.addEventListener('mouseenter', () => {
        clearInterval(testimonialInterval);
    });
    
    testimonialCard.addEventListener('mouseleave', () => {
        testimonialInterval = setInterval(() => {
            currentIndex = (currentIndex + 1) % testimonials.length;
            updateTestimonial();
        }, 6000);
    });
}

// Transport map visualization with enhanced graphics
function initTransportMap() {
    const transportMap = document.getElementById('transport-map');
    if (!transportMap) return;
    
    // Create canvas for map visualization
    const canvas = document.createElement('canvas');
    canvas.width = transportMap.clientWidth;
    canvas.height = transportMap.clientHeight;
    transportMap.appendChild(canvas);
    
    const ctx = canvas.getContext('2d');
    
    // Define locations with more elegant styling
    const locations = [
        { name: 'Airport', x: 80, y: 200, color: '#5E35B1', radius: 12 },
        { name: 'Hotel', x: 250, y: 150, color: '#7B52C7', radius: 12 },
        { name: 'Venue', x: 420, y: 250, color: '#C9B037', radius: 12 }
    ];
    
    // Define routes with curved paths
    const routes = [
        { from: 0, to: 1, color: '#5E35B1', width: 3 },
        { from: 1, to: 2, color: '#C9B037', width: 3 }
    ];
    
    // Define vehicles
    const vehicles = [
        { route: 0, progress: 0, color: '#FFFFFF', size: 6 },
        { route: 1, progress: 0, color: '#FFFFFF', size: 6 }
    ];
    
    // Draw curved path between two points
    function drawCurvedPath(startX, startY, endX, endY, color, width) {
        ctx.beginPath();
        
        // Calculate control point for curve (higher for more pronounced curve)
        const cpX = (startX + endX) / 2;
        const cpY = Math.min(startY, endY) - 50;
        
        ctx.moveTo(startX, startY);
        ctx.quadraticCurveTo(cpX, cpY, endX, endY);
        
        ctx.strokeStyle = color;
        ctx.lineWidth = width;
        ctx.stroke();
        
        return { startX, startY, cpX, cpY, endX, endY };
    }
    
    // Get point along curved path at given percentage
    function getPointOnCurve(curve, t) {
        const { startX, startY, cpX, cpY, endX, endY } = curve;
        
        // Quadratic Bezier formula
        const x = Math.pow(1 - t, 2) * startX + 2 * (1 - t) * t * cpX + Math.pow(t, 2) * endX;
        const y = Math.pow(1 - t, 2) * startY + 2 * (1 - t) * t * cpY + Math.pow(t, 2) * endY;
        
        return { x, y };
    }
    
    // Draw location with glow effect
    function drawLocation(x, y, radius, color, name) {
        // Glow effect
        const gradient = ctx.createRadialGradient(x, y, radius * 0.5, x, y, radius * 2);
        gradient.addColorStop(0, color);
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        
        ctx.beginPath();
        ctx.arc(x, y, radius * 2, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
        
        // Main circle
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
        
        // White inner circle
        ctx.beginPath();
        ctx.arc(x, y, radius * 0.6, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.fill();
        
        // Location name
        ctx.font = '14px Montserrat';
        ctx.fillStyle = '#FFFFFF';
        ctx.textAlign = 'center';
        ctx.fillText(name, x, y - radius - 10);
    }
    
    // Animation loop
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw routes
        const curves = routes.map(route => {
            const fromLocation = locations[route.from];
            const toLocation = locations[route.to];
            
            return drawCurvedPath(
                fromLocation.x, 
                fromLocation.y, 
                toLocation.x, 
                toLocation.y, 
                route.color,
                route.width
            );
        });
        
        // Draw and update vehicles
        vehicles.forEach((vehicle, index) => {
            const curve = curves[vehicle.route];
            
            // Update position
            vehicle.progress += 0.003;
            if (vehicle.progress > 1) vehicle.progress = 0;
            
            const position = getPointOnCurve(curve, vehicle.progress);
            
            // Draw vehicle with glow effect
            const gradient = ctx.createRadialGradient(
                position.x, position.y, 0,
                position.x, position.y, vehicle.size * 2
            );
            gradient.addColorStop(0, vehicle.color);
            gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
            
            ctx.beginPath();
            ctx.arc(position.x, position.y, vehicle.size * 2, 0, Math.PI * 2);
            ctx.fillStyle = gradient;
            ctx.fill();
            
            ctx.beginPath();
            ctx.arc(position.x, position.y, vehicle.size, 0, Math.PI * 2);
            ctx.fillStyle = vehicle.color;
            ctx.fill();
        });
        
        // Draw locations (on top of routes and vehicles)
        locations.forEach(location => {
            drawLocation(location.x, location.y, location.radius, location.color, location.name);
        });
        
        requestAnimationFrame(animate);
    }
    
    animate();
    
    // Handle window resize
    window.addEventListener('resize', () => {
        canvas.width = transportMap.clientWidth;
        canvas.height = transportMap.clientHeight;
        
        // Adjust location positions based on new dimensions
        const widthRatio = canvas.width / 500;
        const heightRatio = canvas.height / 400;
        
        locations[0].x = 80 * widthRatio;
        locations[0].y = 200 * heightRatio;
        
        locations[1].x = 250 * widthRatio;
        locations[1].y = 150 * heightRatio;
        
        locations[2].x = 420 * widthRatio;
        locations[2].y = 250 * heightRatio;
    });
}

// Magnetic button effect with refined interaction
function initMagneticButtons() {
    const buttons = document.querySelectorAll('.btn-primary');
    
    buttons.forEach(btn => {
        let bounds;
        let mouseX;
        let mouseY;
        
        const mouseEnter = () => {
            bounds = btn.getBoundingClientRect();
            document.addEventListener('mousemove', mouseMove);
        };
        
        const mouseMove = (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            
            const mouseXRelative = mouseX - bounds.left;
            const mouseYRelative = mouseY - bounds.top;
            const centerX = bounds.width / 2;
            const centerY = bounds.height / 2;
            
            const distanceX = mouseXRelative - centerX;
            const distanceY = mouseYRelative - centerY;
            
            // More subtle movement for elegance
            gsap.to(btn, {
                x: distanceX * 0.3,
                y: distanceY * 0.3,
                duration: 0.3,
                ease: "power2.out"
            });
        };
        
        const mouseLeave = () => {
            document.removeEventListener('mousemove', mouseMove);
            
            gsap.to(btn, {
                x: 0,
                y: 0,
                duration: 0.7,
                ease: "elastic.out(1, 0.3)"
            });
        };
        
        btn.addEventListener('mouseenter', mouseEnter);
        btn.addEventListener('mouseleave', mouseLeave);
    });
}

// Smooth scrolling for navigation links
function initSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (!targetElement) return;
            
            const navHeight = document.querySelector('.navbar').offsetHeight;
            const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navHeight - 20;
            
            // Smooth scroll with GSAP for better control
            gsap.to(window, {
                duration: 1,
                scrollTo: { y: targetPosition, autoKill: false },
                ease: "power3.inOut"
            });
        });
    });
}
