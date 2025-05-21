// Main JavaScript for animations and interactions

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize GSAP and ScrollTrigger
    gsap.registerPlugin(ScrollTrigger);
    
    // Initialize particles.js for background effects
    initParticles();
    
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
    
    // Initialize form animations
    initFormAnimations();
});

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
    const interactiveElements = document.querySelectorAll('a, button, .card, .feature-card, .testimonial-card, .pricing-card');
    
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            gsap.to(cursorOutline, {
                scale: 1.5,
                opacity: 0.5,
                duration: 0.3
            });
        });
        
        el.addEventListener('mouseleave', () => {
            gsap.to(cursorOutline, {
                scale: 1,
                opacity: 1,
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

// Particles background effect
function initParticles() {
    if (typeof particlesJS !== 'undefined' && document.getElementById('particles-js')) {
        particlesJS('particles-js', {
            particles: {
                number: {
                    value: 80,
                    density: {
                        enable: true,
                        value_area: 800
                    }
                },
                color: {
                    value: "#FFD700"
                },
                shape: {
                    type: "circle",
                    stroke: {
                        width: 0,
                        color: "#000000"
                    },
                },
                opacity: {
                    value: 0.3,
                    random: true,
                    animation: {
                        enable: true,
                        speed: 1,
                        opacity_min: 0.1,
                        sync: false
                    }
                },
                size: {
                    value: 3,
                    random: true,
                    animation: {
                        enable: true,
                        speed: 2,
                        size_min: 0.1,
                        sync: false
                    }
                },
                line_linked: {
                    enable: true,
                    distance: 150,
                    color: "#FFD700",
                    opacity: 0.2,
                    width: 1
                },
                move: {
                    enable: true,
                    speed: 1,
                    direction: "none",
                    random: true,
                    straight: false,
                    out_mode: "out",
                    bounce: false,
                }
            },
            interactivity: {
                detect_on: "canvas",
                events: {
                    onhover: {
                        enable: true,
                        mode: "grab"
                    },
                    onclick: {
                        enable: true,
                        mode: "push"
                    },
                    resize: true
                },
                modes: {
                    grab: {
                        distance: 140,
                        line_linked: {
                            opacity: 0.5
                        }
                    },
                    push: {
                        particles_nb: 4
                    }
                }
            },
            retina_detect: true
        });
    }
}

// Hero section animations
function animateHero() {
    const heroTitle = document.querySelector('.hero-title');
    const heroSubtitle = document.querySelector('.hero-subtitle');
    const heroCta = document.querySelector('.hero-cta');
    const trustBadge = document.querySelector('.trust-badge');
    const heroImage = document.querySelector('.hero-image');
    
    if (!heroTitle || !heroSubtitle || !heroCta || !trustBadge || !heroImage) return;
    
    const heroTimeline = gsap.timeline({ defaults: { ease: "power3.out" } });
    
    heroTimeline
        .to(heroTitle, { opacity: 1, y: 0, duration: 1 })
        .to(heroSubtitle, { opacity: 1, y: 0, duration: 1 }, "-=0.7")
        .to(heroCta, { opacity: 1, y: 0, duration: 1 }, "-=0.7")
        .to(trustBadge, { opacity: 1, y: 0, duration: 1 }, "-=0.7")
        .to(heroImage, { opacity: 1, x: 0, duration: 1 }, "-=0.7");
        
    // Add floating animation to phone mockup
    gsap.to('.phone-mockup', {
        y: -20,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut"
    });
}

// Scroll-triggered animations
function initScrollAnimations() {
    // Animate cards on scroll
    gsap.utils.toArray('.card').forEach(card => {
        gsap.from(card, {
            y: 100,
            opacity: 0,
            duration: 1,
            scrollTrigger: {
                trigger: card,
                start: "top bottom-=100",
                toggleActions: "play none none none"
            }
        });
    });
    
    // Animate feature cards on scroll
    gsap.utils.toArray('.feature-card').forEach((card, i) => {
        gsap.from(card, {
            y: 100,
            opacity: 0,
            duration: 1,
            delay: i * 0.2,
            scrollTrigger: {
                trigger: '.features-container',
                start: "top bottom-=100",
                toggleActions: "play none none none"
            }
        });
    });
    
    // Animate testimonial cards on scroll
    gsap.utils.toArray('.testimonial-card').forEach((card, i) => {
        gsap.from(card, {
            y: 100,
            opacity: 0,
            duration: 1,
            delay: i * 0.2,
            scrollTrigger: {
                trigger: '.testimonials-container',
                start: "top bottom-=100",
                toggleActions: "play none none none"
            }
        });
    });
    
    // Animate pricing cards on scroll
    gsap.utils.toArray('.pricing-card').forEach((card, i) => {
        gsap.from(card, {
            y: 100,
            opacity: 0,
            duration: 1,
            delay: i * 0.2,
            scrollTrigger: {
                trigger: '.pricing-container',
                start: "top bottom-=100",
                toggleActions: "play none none none"
            }
        });
    });
    
    // Animate benefits
    gsap.utils.toArray('.benefit').forEach((benefit, i) => {
        gsap.to(benefit, {
            x: 0,
            opacity: 1,
            duration: 1,
            delay: i * 0.2,
            scrollTrigger: {
                trigger: '.solution-benefits',
                start: "top bottom-=100",
                toggleActions: "play none none none"
            }
        });
    });
    
    // Animate stats
    gsap.utils.toArray('.stat').forEach((stat, i) => {
        gsap.from(stat, {
            y: 50,
            opacity: 0,
            duration: 1,
            delay: i * 0.2,
            scrollTrigger: {
                trigger: '.stats-container',
                start: "top bottom-=100",
                toggleActions: "play none none none"
            }
        });
    });
    
    // Animate steps
    gsap.utils.toArray('.step').forEach((step, i) => {
        const stepTimeline = gsap.timeline({
            scrollTrigger: {
                trigger: step,
                start: "top bottom-=100",
                toggleActions: "play none none none"
            }
        });
        
        stepTimeline
            .from(step.querySelector('.step-number'), { scale: 0, duration: 0.6 })
            .from(step.querySelector('.step-content'), { x: -50, opacity: 0, duration: 0.6 }, "-=0.3")
            .from(step.querySelector('.step-image'), { x: 50, opacity: 0, duration: 0.6 }, "-=0.3");
    });
}

// 3D card tilt effect
function init3DCards() {
    const cards = document.querySelectorAll('.card, .feature-card, .testimonial-card, .pricing-card');
    
    cards.forEach(card => {
        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(20px)`;
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

// Form field animations
function initFormAnimations() {
    const formInputs = document.querySelectorAll('.form-group input, .form-group select');
    
    formInputs.forEach(input => {
        input.addEventListener('focus', () => {
            gsap.to(input, {
                borderColor: '#FFD700',
                boxShadow: '0 0 0 3px rgba(255, 215, 0, 0.3)',
                duration: 0.3
            });
        });
        
        input.addEventListener('blur', () => {
            if (!input.value) {
                gsap.to(input, {
                    borderColor: 'rgba(255, 255, 255, 0.1)',
                    boxShadow: 'none',
                    duration: 0.3
                });
            }
        });
    });
    
    // Form submission animation
    const form = document.querySelector('.contact-form');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const button = form.querySelector('button');
            const originalText = button.textContent;
            
            // Button animation
            gsap.to(button, {
                scale: 0.95,
                duration: 0.1,
                onComplete: () => {
                    gsap.to(button, {
                        scale: 1,
                        duration: 0.3
                    });
                }
            });
            
            // Change button text with loading animation
            button.textContent = "Processing...";
            
            // Simulate form submission (would be replaced with actual AJAX call)
            setTimeout(() => {
                button.textContent = "Success! ✓";
                
                gsap.to(button, {
                    backgroundColor: '#4CAF50',
                    duration: 0.3
                });
                
                // Reset form after delay
                setTimeout(() => {
                    form.reset();
                    button.textContent = originalText;
                    
                    gsap.to(button, {
                        backgroundColor: '',
                        duration: 0.3
                    });
                }, 2000);
            }, 1500);
        });
    }
}

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
                x: distanceX / 6,
                y: distanceY / 6,
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
            
            const targetPosition = targetElement.offsetTop - 100;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        });
    });
});

// Parallax effect for background elements
document.addEventListener('DOMContentLoaded', function() {
    window.addEventListener('scroll', function() {
        const scrollPosition = window.pageYOffset;
        
        // Parallax for hero section
        const heroSection = document.querySelector('.hero-section');
        if (heroSection) {
            heroSection.style.backgroundPosition = `center ${scrollPosition * 0.5}px`;
        }
        
        // Parallax for other sections with backgrounds
        const sections = document.querySelectorAll('.pain-points-section, .solution-section, .testimonials-section');
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            if (scrollPosition + window.innerHeight > sectionTop && scrollPosition < sectionTop + sectionHeight) {
                const yPos = (scrollPosition - sectionTop) * 0.2;
                section.style.backgroundPosition = `center ${yPos}px`;
            }
        });
    });
});

// Responsive navigation menu
document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.createElement('div');
    menuToggle.className = 'menu-toggle';
    menuToggle.innerHTML = '<span></span><span></span><span></span>';
    
    const nav = document.querySelector('nav');
    const navLinks = document.querySelector('.nav-links');
    
    if (nav && navLinks) {
        nav.insertBefore(menuToggle, navLinks);
        
        menuToggle.addEventListener('click', function() {
            this.classList.toggle('active');
            navLinks.classList.toggle('active');
        });
    }
});

// Add this to your CSS
document.addEventListener('DOMContentLoaded', function() {
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
            height: 3px;
            width: 100%;
            background-color: var(--text-color);
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
                background: var(--primary-color);
                flex-direction: column;
                align-items: center;
                padding: 20px 0;
                clip-path: circle(0% at top right);
                transition: clip-path 0.5s ease-in-out;
            }
            
            .nav-links.active {
                clip-path: circle(150% at top right);
                display: flex;
            }
        }
    `;
    document.head.appendChild(style);
});
