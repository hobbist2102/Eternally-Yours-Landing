// animations.js - Advanced animation system for eternallyyoursrsvp.in
// Implements scroll-triggered animations, micro-interactions, and parallax effects

// Initialize animations when document is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Animations will be initialized after loading screen completes
});

// Main animation initialization
function initAnimations() {
  // Initialize all animation systems
  initScrollAnimations();
  initParallaxEffects();
  initMicroInteractions();
  initCustomCursor();
  initNavigationEffects();
}

// Scroll-triggered animations using Intersection Observer
function initScrollAnimations() {
  // Elements to animate on scroll
  const animatedElements = document.querySelectorAll('.animate-on-scroll');
  
  // Intersection Observer options
  const observerOptions = {
    root: null, // viewport
    rootMargin: '0px',
    threshold: 0.15 // 15% of element must be visible
  };
  
  // Create observer
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Get animation type from data attribute
        const animationType = entry.target.dataset.animation || 'fade-in';
        const delay = entry.target.dataset.delay || 0;
        
        // Add animation class with delay
        setTimeout(() => {
          entry.target.classList.add(`animate-${animationType}`);
          entry.target.style.opacity = '1';
        }, delay);
        
        // Unobserve after animation
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);
  
  // Observe all animated elements
  animatedElements.forEach(element => {
    // Set initial opacity to 0
    element.style.opacity = '0';
    observer.observe(element);
  });
  
  // Special handling for section titles
  const sectionTitles = document.querySelectorAll('.section-title');
  sectionTitles.forEach(title => {
    // Create underline element
    const underline = document.createElement('span');
    underline.classList.add('title-underline');
    title.appendChild(underline);
    
    // Observe title for animation
    observer.observe(title);
  });
}

// Parallax effects for background layers
function initParallaxEffects() {
  // Hero section parallax
  const parallaxLayers = document.querySelectorAll('.parallax-layer');
  
  // Listen for scroll events
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    
    // Move each layer at different speeds
    parallaxLayers.forEach(layer => {
      const speed = layer.dataset.speed || 0.1;
      const yPos = -(scrollY * speed);
      layer.style.transform = `translateY(${yPos}px)`;
    });
  });
  
  // Mouse movement parallax for hero section
  const heroSection = document.querySelector('.hero-section');
  
  if (heroSection) {
    heroSection.addEventListener('mousemove', (e) => {
      const mouseX = e.clientX;
      const mouseY = e.clientY;
      
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      
      const deltaX = (mouseX - centerX) / centerX;
      const deltaY = (mouseY - centerY) / centerY;
      
      // Move layers based on mouse position
      parallaxLayers.forEach(layer => {
        const speedX = layer.dataset.speedX || 2;
        const speedY = layer.dataset.speedY || 2;
        
        const moveX = deltaX * speedX;
        const moveY = deltaY * speedY;
        
        layer.style.transform = `translate(${moveX}%, ${moveY}%)`;
      });
    });
  }
}

// Micro-interactions for buttons, cards, and UI elements
function initMicroInteractions() {
  // Magnetic buttons
  const magneticButtons = document.querySelectorAll('.btn-primary, .btn-secondary, .nav-link.cta');
  
  magneticButtons.forEach(button => {
    button.addEventListener('mousemove', (e) => {
      const rect = button.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const deltaX = (x - centerX) / centerX;
      const deltaY = (y - centerY) / centerY;
      
      // Magnetic effect - subtle movement toward cursor
      const moveX = deltaX * 5;
      const moveY = deltaY * 5;
      
      button.style.transform = `translate(${moveX}px, ${moveY}px)`;
      
      // Highlight effect
      const shine = button.querySelector('.btn-shine') || document.createElement('span');
      if (!button.querySelector('.btn-shine')) {
        shine.classList.add('btn-shine');
        button.appendChild(shine);
      }
      
      shine.style.opacity = '1';
      shine.style.left = `${x}px`;
      shine.style.top = `${y}px`;
    });
    
    button.addEventListener('mouseleave', () => {
      // Reset position
      button.style.transform = 'translate(0, 0)';
      
      // Fade out shine
      const shine = button.querySelector('.btn-shine');
      if (shine) {
        shine.style.opacity = '0';
      }
    });
  });
  
  // 3D Card tilt effect
  const tiltCards = document.querySelectorAll('.challenge-card, .feature-card');
  
  tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const deltaX = (x - centerX) / centerX;
      const deltaY = (y - centerY) / centerY;
      
      // Calculate tilt angles
      const tiltX = deltaY * 10;
      const tiltY = -deltaX * 10;
      
      // Apply 3D transform
      card.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(1.02, 1.02, 1.02)`;
      
      // Dynamic shadow
      const shadowX = deltaX * 10;
      const shadowY = deltaY * 10;
      card.style.boxShadow = `${shadowX}px ${shadowY}px 30px rgba(0, 0, 0, 0.2)`;
      
      // Move card content for enhanced 3D effect
      const cardContent = card.querySelector('.card-content');
      const cardIcon = card.querySelector('.card-icon, .feature-icon');
      
      if (cardContent) {
        cardContent.style.transform = `translateZ(20px)`;
      }
      
      if (cardIcon) {
        cardIcon.style.transform = `translateZ(40px) translateX(${deltaX * 10}px) translateY(${deltaY * 10}px)`;
      }
    });
    
    card.addEventListener('mouseleave', () => {
      // Reset transforms
      card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
      card.style.boxShadow = 'var(--shadow-md)';
      
      const cardContent = card.querySelector('.card-content');
      const cardIcon = card.querySelector('.card-icon, .feature-icon');
      
      if (cardContent) {
        cardContent.style.transform = 'translateZ(0)';
      }
      
      if (cardIcon) {
        cardIcon.style.transform = 'translateZ(0)';
      }
    });
  });
  
  // WhatsApp message animation
  animateWhatsAppMessages();
}

// Animate WhatsApp messages with typing indicators and sequential appearance
function animateWhatsAppMessages() {
  const messageBubbles = document.querySelectorAll('.message-bubble');
  const typingIndicator = document.querySelector('.typing-indicator');
  
  // Hide all messages initially
  messageBubbles.forEach(bubble => {
    bubble.style.opacity = '0';
    bubble.style.transform = 'translateY(20px)';
  });
  
  // Show messages sequentially
  let delay = 1000;
  messageBubbles.forEach((bubble, index) => {
    setTimeout(() => {
      // Show typing indicator before guest messages
      if (bubble.classList.contains('guest') && typingIndicator) {
        typingIndicator.style.display = 'flex';
        
        setTimeout(() => {
          typingIndicator.style.display = 'none';
          
          // Show message
          bubble.style.opacity = '1';
          bubble.style.transform = 'translateY(0)';
        }, 1500);
      } else {
        // Show host message immediately
        bubble.style.opacity = '1';
        bubble.style.transform = 'translateY(0)';
      }
    }, delay);
    
    // Increase delay for next message
    delay += bubble.classList.contains('guest') ? 3000 : 1500;
  });
}

// Custom cursor effect
function initCustomCursor() {
  const cursor = document.querySelector('.custom-cursor');
  const cursorDot = document.querySelector('.cursor-dot');
  const cursorCircle = document.querySelector('.cursor-circle');
  
  if (!cursor || !cursorDot || !cursorCircle) return;
  
  // Update cursor position on mouse move
  document.addEventListener('mousemove', (e) => {
    // Position dot at cursor position
    cursorDot.style.left = `${e.clientX}px`;
    cursorDot.style.top = `${e.clientY}px`;
    
    // Position circle with slight delay for trailing effect
    setTimeout(() => {
      cursorCircle.style.left = `${e.clientX}px`;
      cursorCircle.style.top = `${e.clientY}px`;
    }, 50);
  });
  
  // Hover effects for interactive elements
  const interactiveElements = document.querySelectorAll('a, button, .btn, .nav-link, .feature-card, .challenge-card');
  
  interactiveElements.forEach(element => {
    element.addEventListener('mouseenter', () => {
      // Expand circle and change opacity
      cursorCircle.style.width = '60px';
      cursorCircle.style.height = '60px';
      cursorCircle.style.opacity = '0.5';
      cursorDot.style.opacity = '0.5';
    });
    
    element.addEventListener('mouseleave', () => {
      // Reset to default
      cursorCircle.style.width = '40px';
      cursorCircle.style.height = '40px';
      cursorCircle.style.opacity = '1';
      cursorDot.style.opacity = '1';
    });
  });
  
  // Hide cursor when leaving window
  document.addEventListener('mouseout', (e) => {
    if (e.relatedTarget === null) {
      cursor.style.opacity = '0';
    }
  });
  
  document.addEventListener('mouseover', () => {
    cursor.style.opacity = '1';
  });
}

// Navigation effects (scroll behavior, active states)
function initNavigationEffects() {
  const mainNav = document.querySelector('.main-navigation');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section');
  
  // Change navigation background on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      mainNav.classList.add('scrolled');
    } else {
      mainNav.classList.remove('scrolled');
    }
    
    // Update active nav link based on scroll position
    let currentSection = '';
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      
      if (window.scrollY >= sectionTop - 200 && window.scrollY < sectionTop + sectionHeight - 200) {
        currentSection = section.getAttribute('id');
      }
    });
    
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSection}`) {
        link.classList.add('active');
      }
    });
  });
  
  // Smooth scroll for navigation links
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      if (link.getAttribute('href').startsWith('#')) {
        e.preventDefault();
        
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
          window.scrollTo({
            top: targetSection.offsetTop - 100,
            behavior: 'smooth'
          });
        }
      }
    });
  });
  
  // Mobile navigation toggle
  const navToggle = document.querySelector('.nav-toggle');
  const navLinksContainer = document.querySelector('.nav-links');
  
  if (navToggle && navLinksContainer) {
    navToggle.addEventListener('click', () => {
      navLinksContainer.classList.toggle('active');
      
      // Animate toggle icon
      const toggleBars = navToggle.querySelectorAll('span');
      toggleBars.forEach(bar => {
        bar.classList.toggle('active');
      });
    });
  }
}
