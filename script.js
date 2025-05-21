// Main JavaScript for animations and interactions

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize Three.js for starlit sky
    initStarlitSky();
    
    // Initialize custom cursor
    initCustomCursor();
    
    // Initialize scroll progress bar
    initScrollProgress();
    
    // Initialize hero animations
    animateHero();
    
    // Initialize scroll animations
    initScrollAnimations();
    
    // Initialize 3D card effects
    init3DCards();
    
    // Initialize responsive navigation
    initResponsiveNav();
    
    // Initialize testimonial slider
    initTestimonialSlider();
    
    // Initialize transport map visualization
    initTransportMap();
});

// Starlit sky background with Three.js
function initStarlitSky() {
    const container = document.getElementById('starlit-sky');
    if (!container) return;
    
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    
    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);
    
    // Create stars
    const starsGeometry = new THREE.BufferGeometry();
    const starsMaterial = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.7,
        transparent: true
    });
    
    const starsVertices = [];
    const starsCount = 1000;
    
    for (let i = 0; i < starsCount; i++) {
        const x = (Math.random() - 0.5) * 2000;
        const y = (Math.random() - 0.5) * 2000;
        const z = (Math.random() - 0.5) * 2000;
        starsVertices.push(x, y, z);
    }
    
    starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starsVertices, 3));
    const stars = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(stars);
    
    // Create some larger, golden stars
    const goldenStarsGeometry = new THREE.BufferGeometry();
    const goldenStarsMaterial = new THREE.PointsMaterial({
        color: 0xC9B037,
        size: 1.5,
        transparent: true
    });
    
    const goldenStarsVertices = [];
    const goldenStarsCount = 100;
    
    for (let i = 0; i < goldenStarsCount; i++) {
        const x = (Math.random() - 0.5) * 2000;
        const y = (Math.random() - 0.5) * 2000;
        const z = (Math.random() - 0.5) * 2000;
        goldenStarsVertices.push(x, y, z);
    }
    
    goldenStarsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(goldenStarsVertices, 3));
    const goldenStars = new THREE.Points(goldenStarsGeometry, goldenStarsMaterial);
    scene.add(goldenStars);
    
    // Add some subtle shooting stars occasionally
    function createShootingStar() {
        const shootingStarGeometry = new THREE.BufferGeometry();
        const shootingStarMaterial = new THREE.PointsMaterial({
            color: 0xffffff,
            size: 2,
            transparent: true,
            opacity: 1
        });
        
        const startX = (Math.random() - 0.5) * 1000;
        const startY = (Math.random() - 0.5) * 1000 + 500;
        const startZ = -500;
        
        const vertices = [startX, startY, startZ];
        shootingStarGeometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
        
        const shootingStar = new THREE.Points(shootingStarGeometry, shootingStarMaterial);
        scene.add(shootingStar);
        
        // Animate the shooting star
        const endX = startX + (Math.random() - 0.5) * 200;
        const endY = startY - 500;
        
        gsap.to(shootingStar.position, {
            x: endX,
            y: endY,
            duration: 1.5,
            ease: "power1.in",
            onComplete: () => {
                scene.remove(shootingStar);
                shootingStarGeometry.dispose();
                shootingStarMaterial.dispose();
            }
        });
        
        gsap.to(shootingStarMaterial, {
            opacity: 0,
            duration: 1.5,
            ease: "power1.in"
        });
    }
    
    // Create shooting stars at random intervals
    setInterval(() => {
        if (Math.random() > 0.7) {
            createShootingStar();
        }
    }, 3000);
    
    camera.position.z = 1000;
    
    // Handle window resize
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
    
    // Animation loop
    function animate() {
        requestAnimationFrame(animate);
        
        stars.rotation.y += 0.0002;
        stars.rotation.x += 0.0001;
        
        goldenStars.rotation.y += 0.0001;
        goldenStars.rotation.x += 0.0002;
        
        renderer.render(scene, camera);
    }
    
    animate();
}

// Custom cursor implementation
function initCustomCursor() {
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');
    
    if (!cursorDot || !cursorOutline) return;
    
    window.addEventListener('mousemove', function(e) {
        const posX = e.clientX;
        const posY = e.clientY;
        
        // Animate cursor dot to follow mouse exactly
        gsap.to(cursorDot, {
            x: posX,
            y: posY,
            duration: 0.1
        });
        
        // Animate cursor outline with slight delay for smooth effect
        gsap.to(cursorOutline, {
            x: posX,
            y: posY,
            duration: 0.3
        });
    });
    
    // Scale effect when hovering over interactive elements
    const interactiveElements = document.querySelectorAll('a, button, .feature-card, .communication-card, .transport-feature, .testimonial-dot');
    
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            gsap.to(cursorOutline, {
                scale: 1.5,
                opacity: 0.5,
                borderColor: '#C9B037',
                duration: 0.3
            });
            
            gsap.to(cursorDot, {
                scale: 1.5,
                backgroundColor: '#C9B037',
                duration: 0.3
            });
        });
        
        el.addEventListener('mouseleave', () => {
            gsap.to(cursorOutline, {
                scale: 1,
                opacity: 1,
                borderColor: '#C9B037',
                duration: 0.3
            });
            
            gsap.to(cursorDot, {
                scale: 1,
                backgroundColor: '#C9B037',
                duration: 0.3
            });
        });
    });
    
    // Hide cursor when leaving window
    document.addEventListener('mouseleave', () => {
        gsap.to([cursorDot, cursorOutline], {
            opacity: 0,
            duration: 0.3
        });
    });
    
    document.addEventListener('mouseenter', () => {
        gsap.to([cursorDot, cursorOutline], {
            opacity: 1,
            duration: 0.3
        });
    });
    
    // Hide default cursor
    document.body.style.cursor = 'none';
    
    // Show default cursor on touch devices
    if ('ontouchstart' in window) {
        document.body.style.cursor = 'auto';
        cursorDot.style.display = 'none';
        cursorOutline.style.display = 'none';
    }
}

// Scroll progress bar
function initScrollProgress() {
    const progressBar = document.querySelector('.progress-bar');
    
    if (!progressBar) return;
    
    window.addEventListener('scroll', () => {
        const totalHeight = document.body.scrollHeight - window.innerHeight;
        const progress = (window.pageYOffset / totalHeight) * 100;
        progressBar.style.width = `${progress}%`;
    });
}

// Hero section animations
function animateHero() {
    const heroContent = document.querySelector('.hero-content');
    const scrollIndicator = document.querySelector('.scroll-indicator');
    
    if (!heroContent || !scrollIndicator) return;
    
    const heroTimeline = gsap.timeline({ defaults: { ease: "power3.out" } });
    
    heroTimeline
        .to(heroContent, { opacity: 1, y: 0, duration: 1.5, delay: 0.5 })
        .to(scrollIndicator, { opacity: 1, duration: 1 }, "-=0.5");
}

// Scroll-triggered animations
function initScrollAnimations() {
    // Animate section headers
    gsap.utils.toArray('.section-header').forEach(header => {
        gsap.from(header, {
            y: 50,
            opacity: 0,
            duration: 1,
            scrollTrigger: {
                trigger: header,
                start: "top bottom-=100",
                toggleActions: "play none none none"
            }
        });
    });
    
    // Animate feature cards
    gsap.utils.toArray('.feature-card').forEach((card, i) => {
        gsap.from(card, {
            y: 100,
            opacity: 0,
            duration: 1,
            delay: i * 0.2,
            scrollTrigger: {
                trigger: '.feature-grid',
                start: "top bottom-=100",
                toggleActions: "play none none none"
            }
        });
    });
    
    // Animate transport features
    gsap.utils.toArray('.transport-feature').forEach((feature, i) => {
        gsap.to(feature, {
            x: 0,
            opacity: 1,
            duration: 1,
            delay: i * 0.2,
            scrollTrigger: {
                trigger: '.transport-features',
                start: "top bottom-=100",
                toggleActions: "play none none none"
            }
        });
    });
    
    // Animate communication cards
    gsap.utils.toArray('.communication-card').forEach((card, i) => {
        gsap.from(card, {
            y: 100,
            opacity: 0,
            duration: 1,
            delay: i * 0.2,
            scrollTrigger: {
                trigger: '.communication-grid',
                start: "top bottom-=100",
                toggleActions: "play none none none"
            }
        });
    });
    
    // Animate testimonial card
    gsap.from('.testimonial-card', {
        y: 50,
        opacity: 0,
        duration: 1,
        scrollTrigger: {
            trigger: '.testimonial-slider',
            start: "top bottom-=100",
            toggleActions: "play none none none"
        }
    });
    
    // Animate CTA section
    gsap.from('.cta-title', {
        y: 50,
        opacity: 0,
        duration: 1,
        scrollTrigger: {
            trigger: '.cta-section',
            start: "top bottom-=100",
            toggleActions: "play none none none"
        }
    });
    
    gsap.from('.cta-text', {
        y: 50,
        opacity: 0,
        duration: 1,
        delay: 0.2,
        scrollTrigger: {
            trigger: '.cta-section',
            start: "top bottom-=100",
            toggleActions: "play none none none"
        }
    });
    
    gsap.from('.cta-section .btn-primary', {
        y: 50,
        opacity: 0,
        duration: 1,
        delay: 0.4,
        scrollTrigger: {
            trigger: '.cta-section',
            start: "top bottom-=100",
            toggleActions: "play none none none"
        }
    });
    
    // Animate chat messages
    gsap.utils.toArray('.chat-message').forEach((message, i) => {
        gsap.from(message, {
            y: 20,
            opacity: 0,
            duration: 0.5,
            delay: i * 0.3,
            scrollTrigger: {
                trigger: message.closest('.chat-container'),
                start: "top bottom-=100",
                toggleActions: "play none none none"
            }
        });
    });
}

// 3D card tilt effect
function init3DCards() {
    const cards = document.querySelectorAll('.feature-card, .communication-card, .testimonial-card, .intro-card');
    
    cards.forEach(card => {
        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
            setTimeout(() => {
                card.style.transition = '';
            }, 300);
        });
        
        card.addEventListener('mouseenter', () => {
            card.style.transition = 'none';
        });
    });
}

// Responsive navigation
function initResponsiveNav() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (!menuToggle || !navLinks) return;
    
    menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('active');
        navLinks.classList.toggle('active');
    });
    
    // Close menu when clicking a link
    const links = navLinks.querySelectorAll('a');
    links.forEach(link => {
        link.addEventListener('click', () => {
            menuToggle.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });
    
    // Add styles for responsive menu
    const style = document.createElement('style');
    style.textContent = `
        .menu-toggle {
            display: none;
            flex-direction: column;
            justify-content: space-between;
            width: 30px;
            height: 21px;
            cursor: pointer;
        }
        
        .menu-toggle span {
            display: block;
            height: 2px;
            width: 100%;
            background-color: var(--accent-color);
            transition: all 0.3s ease;
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
        
        @media (max-width: 768px) {
            .menu-toggle {
                display: flex;
            }
            
            .nav-links {
                position: fixed;
                top: 80px;
                left: 0;
                width: 100%;
                background: rgba(26, 9, 51, 0.95);
                backdrop-filter: blur(10px);
                flex-direction: column;
                align-items: center;
                padding: 20px 0;
                clip-path: circle(0% at top right);
                transition: clip-path 0.5s ease-in-out;
                display: none;
            }
            
            .nav-links.active {
                clip-path: circle(150% at top right);
                display: flex;
            }
            
            .nav-link {
                margin: 15px 0;
            }
        }
    `;
    document.head.appendChild(style);
}

// Testimonial slider
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
            currentIndex = index;
            updateTestimonial();
        });
    });
    
    function updateTestimonial() {
        // Update active dot
        dots.forEach((dot, index) => {
            if (index === currentIndex) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
        
        // Animate out current testimonial
        gsap.to(testimonialCard, {
            opacity: 0,
            y: -20,
            duration: 0.5,
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
                    opacity: 1,
                    y: 0,
                    duration: 0.5
                });
            }
        });
    }
    
    // Auto-rotate testimonials
    setInterval(() => {
        currentIndex = (currentIndex + 1) % testimonials.length;
        updateTestimonial();
    }, 5000);
}

// Transport map visualization
function initTransportMap() {
    const transportMap = document.querySelector('.transport-map');
    if (!transportMap) return;
    
    // Create canvas for map visualization
    const canvas = document.createElement('canvas');
    canvas.width = transportMap.clientWidth;
    canvas.height = transportMap.clientHeight;
    transportMap.appendChild(canvas);
    
    const ctx = canvas.getContext('2d');
    
    // Define locations
    const locations = [
        { name: 'Airport', x: 50, y: 200, color: '#5E35B1' },
        { name: 'Hotel', x: 250, y: 150, color: '#5E35B1' },
        { name: 'Venue', x: 450, y: 250, color: '#C9B037' }
    ];
    
    // Define routes
    const routes = [
        { from: 0, to: 1, color: '#5E35B1' },
        { from: 1, to: 2, color: '#C9B037' }
    ];
    
    // Define vehicles
    const vehicles = [
        { route: 0, progress: 0, color: '#FFFFFF', size: 8 },
        { route: 1, progress: 0, color: '#FFFFFF', size: 8 }
    ];
    
    // Animation loop
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw routes
        routes.forEach(route => {
            const fromLocation = locations[route.from];
            const toLocation = locations[route.to];
            
            ctx.beginPath();
            ctx.moveTo(fromLocation.x, fromLocation.y);
            ctx.lineTo(toLocation.x, toLocation.y);
            ctx.strokeStyle = route.color;
            ctx.lineWidth = 2;
            ctx.stroke();
        });
        
        // Draw locations
        locations.forEach(location => {
            ctx.beginPath();
            ctx.arc(location.x, location.y, 10, 0, Math.PI * 2);
            ctx.fillStyle = location.color;
            ctx.fill();
            
            ctx.font = '14px Cormorant Garamond';
            ctx.fillStyle = '#FFFFFF';
            ctx.textAlign = 'center';
            ctx.fillText(location.name, location.x, location.y - 20);
        });
        
        // Draw and update vehicles
        vehicles.forEach(vehicle => {
            const route = routes[vehicle.route];
            const fromLocation = locations[route.from];
            const toLocation = locations[route.to];
            
            // Update position
            vehicle.progress += 0.005;
            if (vehicle.progress > 1) vehicle.progress = 0;
            
            const x = fromLocation.x + (toLocation.x - fromLocation.x) * vehicle.progress;
            const y = fromLocation.y + (toLocation.y - fromLocation.y) * vehicle.progress;
            
            // Draw vehicle
            ctx.beginPath();
            ctx.arc(x, y, vehicle.size, 0, Math.PI * 2);
            ctx.fillStyle = vehicle.color;
            ctx.fill();
        });
        
        requestAnimationFrame(animate);
    }
    
    animate();
    
    // Handle window resize
    window.addEventListener('resize', () => {
        canvas.width = transportMap.clientWidth;
        canvas.height = transportMap.clientHeight;
    });
}

// Smooth scrolling for navigation links
document.addEventListener('DOMContentLoaded', function() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (!targetElement) return;
            
            const navHeight = document.querySelector('nav').offsetHeight;
            const targetPosition = targetElement.offsetTop - navHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        });
    });
});

// Magnetic button effect
document.addEventListener('DOMContentLoaded', function() {
    const buttons = document.querySelectorAll('.btn-primary');
    
    buttons.forEach(btn => {
        btn.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const distanceX = x - centerX;
            const distanceY = y - centerY;
            
            gsap.to(this, {
                x: distanceX / 10,
                y: distanceY / 10,
                duration: 0.3,
                ease: "power2.out"
            });
        });
        
        btn.addEventListener('mouseleave', function() {
            gsap.to(this, {
                x: 0,
                y: 0,
                duration: 0.5,
                ease: "elastic.out(1, 0.3)"
            });
        });
    });
});

