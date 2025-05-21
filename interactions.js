// interactions.js - Advanced interactive elements for Eternally Yours
// This script handles all user interactions, 3D card effects, and
// sophisticated UI behaviors throughout the site

class InteractionSystem {
  constructor() {
    // Store interactive elements
    this.cards3D = [];
    this.magneticElements = [];
    
    // Interaction configuration
    this.config = {
      cardTiltMaxDegree: 10,
      cardTiltPerspective: 1000,
      cardTiltSpeed: 400,
      cardTiltScale: 1.05,
      magneticStrength: 0.3,
      magneticRadius: 100,
      magneticLerp: 0.2
    };
    
    // Mouse position
    this.mouse = {
      x: 0,
      y: 0,
      lastX: 0,
      lastY: 0,
      velocity: { x: 0, y: 0 }
    };
    
    // Initialize
    this.init();
  }
  
  init() {
    // Initialize once DOM is loaded
    window.addEventListener('load', () => {
      this.setupEventListeners();
      this.setup3DCards();
      this.setupMagneticElements();
      this.setupNavigation();
      this.setupScrollIndicator();
    });
  }
  
  setupEventListeners() {
    // Track mouse position
    document.addEventListener('mousemove', this.onMouseMove.bind(this));
    
    // Update on scroll
    window.addEventListener('scroll', this.onScroll.bind(this));
    
    // Handle resize
    window.addEventListener('resize', this.onResize.bind(this));
    
    // Start animation loop
    this.animate();
  }
  
  onMouseMove(event) {
    // Store previous position
    this.mouse.lastX = this.mouse.x;
    this.mouse.lastY = this.mouse.y;
    
    // Update current position
    this.mouse.x = event.clientX;
    this.mouse.y = event.clientY;
    
    // Calculate velocity
    this.mouse.velocity.x = this.mouse.x - this.mouse.lastX;
    this.mouse.velocity.y = this.mouse.y - this.mouse.lastY;
  }
  
  onScroll() {
    // Update navigation state
    this.updateNavigation();
    
    // Update scroll-dependent interactions
    this.updateScrollInteractions();
  }
  
  onResize() {
    // Update card positions and dimensions
    this.updateCardDimensions();
  }
  
  setup3DCards() {
    // Find all elements with 3D card effect
    const cardElements = [
      ...document.querySelectorAll('.feature-card'),
      ...document.querySelectorAll('.challenge-card')
    ];
    
    // Initialize each card
    cardElements.forEach(card => {
      // Create card object
      const cardObj = {
        element: card,
        rect: card.getBoundingClientRect(),
        centerX: 0,
        centerY: 0,
        targetRotateX: 0,
        targetRotateY: 0,
        currentRotateX: 0,
        currentRotateY: 0,
        targetScale: 1,
        currentScale: 1,
        isHovered: false
      };
      
      // Calculate center position
      this.updateCardCenter(cardObj);
      
      // Add event listeners
      card.addEventListener('mouseenter', () => this.onCardEnter(cardObj));
      card.addEventListener('mouseleave', () => this.onCardLeave(cardObj));
      card.addEventListener('mousemove', (e) => this.onCardMove(e, cardObj));
      
      // Add to cards array
      this.cards3D.push(cardObj);
    });
  }
  
  updateCardCenter(card) {
    // Update card dimensions
    card.rect = card.element.getBoundingClientRect();
    
    // Calculate center position
    card.centerX = card.rect.left + card.rect.width / 2;
    card.centerY = card.rect.top + card.rect.height / 2;
  }
  
  updateCardDimensions() {
    // Update all card dimensions
    this.cards3D.forEach(card => {
      this.updateCardCenter(card);
    });
  }
  
  onCardEnter(card) {
    // Set hovered state
    card.isHovered = true;
    
    // Set initial target scale
    card.targetScale = this.config.cardTiltScale;
    
    // Add active class
    card.element.classList.add('card-active');
  }
  
  onCardLeave(card) {
    // Reset hovered state
    card.isHovered = false;
    
    // Reset target rotation and scale
    card.targetRotateX = 0;
    card.targetRotateY = 0;
    card.targetScale = 1;
    
    // Remove active class
    card.element.classList.remove('card-active');
  }
  
  onCardMove(event, card) {
    if (!card.isHovered) return;
    
    // Calculate mouse position relative to card center
    const mouseX = event.clientX - card.centerX;
    const mouseY = event.clientY - card.centerY;
    
    // Calculate rotation based on mouse position
    // Invert Y axis for natural tilt effect
    card.targetRotateY = mouseX / card.rect.width * this.config.cardTiltMaxDegree;
    card.targetRotateX = -mouseY / card.rect.height * this.config.cardTiltMaxDegree;
  }
  
  updateCards() {
    // Update each card's rotation and scale with smooth interpolation
    this.cards3D.forEach(card => {
      // Smoothly interpolate rotation
      card.currentRotateX += (card.targetRotateX - card.currentRotateX) / this.config.cardTiltSpeed;
      card.currentRotateY += (card.targetRotateY - card.currentRotateY) / this.config.cardTiltSpeed;
      
      // Smoothly interpolate scale
      card.currentScale += (card.targetScale - card.currentScale) / this.config.cardTiltSpeed;
      
      // Apply transform
      card.element.style.transform = `
        perspective(${this.config.cardTiltPerspective}px)
        rotateX(${card.currentRotateX}deg)
        rotateY(${card.currentRotateY}deg)
        scale3d(${card.currentScale}, ${card.currentScale}, ${card.currentScale})
      `;
    });
  }
  
  setupMagneticElements() {
    // Find all elements with magnetic effect
    const magneticElements = document.querySelectorAll('.btn-primary, .btn-large');
    
    // Initialize each magnetic element
    magneticElements.forEach(element => {
      // Create magnetic object
      const magneticObj = {
        element: element,
        rect: element.getBoundingClientRect(),
        centerX: 0,
        centerY: 0,
        targetX: 0,
        targetY: 0,
        currentX: 0,
        currentY: 0,
        isActive: false
      };
      
      // Calculate center position
      this.updateMagneticCenter(magneticObj);
      
      // Add to magnetic elements array
      this.magneticElements.push(magneticObj);
    });
  }
  
  updateMagneticCenter(magnetic) {
    // Update dimensions
    magnetic.rect = magnetic.element.getBoundingClientRect();
    
    // Calculate center position
    magnetic.centerX = magnetic.rect.left + magnetic.rect.width / 2;
    magnetic.centerY = magnetic.rect.top + magnetic.rect.height / 2;
  }
  
  updateMagneticElements() {
    // Update each magnetic element
    this.magneticElements.forEach(magnetic => {
      // Update center position
      this.updateMagneticCenter(magnetic);
      
      // Calculate distance from mouse to element center
      const distX = this.mouse.x - magnetic.centerX;
      const distY = this.mouse.y - magnetic.centerY;
      const distance = Math.sqrt(distX * distX + distY * distY);
      
      // Check if mouse is within magnetic radius
      if (distance < this.config.magneticRadius) {
        // Element is active
        magnetic.isActive = true;
        
        // Calculate magnetic pull (stronger when closer)
        const pull = (this.config.magneticRadius - distance) / this.config.magneticRadius;
        
        // Set target position with magnetic pull
        magnetic.targetX = distX * pull * this.config.magneticStrength;
        magnetic.targetY = distY * pull * this.config.magneticStrength;
      } else if (magnetic.isActive) {
        // Reset target position when mouse leaves radius
        magnetic.isActive = false;
        magnetic.targetX = 0;
        magnetic.targetY = 0;
      }
      
      // Smoothly interpolate position
      magnetic.currentX += (magnetic.targetX - magnetic.currentX) * this.config.magneticLerp;
      magnetic.currentY += (magnetic.targetY - magnetic.currentY) * this.config.magneticLerp;
      
      // Apply transform if there's movement
      if (Math.abs(magnetic.currentX) > 0.01 || Math.abs(magnetic.currentY) > 0.01) {
        magnetic.element.style.transform = `translate(${magnetic.currentX}px, ${magnetic.currentY}px)`;
      } else {
        magnetic.element.style.transform = '';
      }
    });
  }
  
  setupNavigation() {
    const nav = document.querySelector('.main-navigation');
    const navLinks = document.querySelectorAll('.nav-link');
    const navToggle = document.querySelector('.nav-toggle');
    const navLinksContainer = document.querySelector('.nav-links');
    
    if (!nav || !navLinks.length) return;
    
    // Handle navigation toggle for mobile
    if (navToggle && navLinksContainer) {
      navToggle.addEventListener('click', () => {
        navLinksContainer.classList.toggle('active');
        navToggle.classList.toggle('active');
      });
    }
    
    // Handle smooth scrolling for navigation links
    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        // Get the target section
        const targetId = link.getAttribute('href');
        if (targetId && targetId.startsWith('#')) {
          e.preventDefault();
          
          const targetSection = document.querySelector(targetId);
          if (targetSection) {
            // Close mobile menu if open
            if (navLinksContainer && navLinksContainer.classList.contains('active')) {
              navLinksContainer.classList.remove('active');
              navToggle.classList.remove('active');
            }
            
            // Smooth scroll to target
            window.scrollTo({
              top: targetSection.offsetTop - 80, // Offset for fixed header
              behavior: 'smooth'
            });
            
            // Update URL without scrolling
            history.pushState(null, null, targetId);
          }
        }
      });
    });
    
    // Initial navigation update
    this.updateNavigation();
  }
  
  updateNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const scrollPosition = window.scrollY + 100; // Offset for better detection
    
    // Find the current section
    navLinks.forEach(link => {
      const targetId = link.getAttribute('href');
      if (targetId && targetId.startsWith('#') && targetId !== '#') {
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
          const sectionTop = targetSection.offsetTop;
          const sectionHeight = targetSection.offsetHeight;
          
          // Check if current scroll position is within this section
          if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            // Add active class to current section link
            link.classList.add('active');
          } else {
            // Remove active class from other links
            link.classList.remove('active');
          }
        }
      }
    });
  }
  
  setupScrollIndicator() {
    const scrollIndicator = document.querySelector('.scroll-indicator');
    
    if (!scrollIndicator) return;
    
    // Add click event to scroll to next section
    scrollIndicator.addEventListener('click', () => {
      const heroSection = document.querySelector('.hero-section');
      const nextSection = heroSection.nextElementSibling;
      
      if (nextSection) {
        window.scrollTo({
          top: nextSection.offsetTop - 80, // Offset for fixed header
          behavior: 'smooth'
        });
      }
    });
  }
  
  updateScrollInteractions() {
    // Get scroll progress
    const scrollProgress = window.scrollY / (document.body.scrollHeight - window.innerHeight);
    
    // Update any scroll-dependent interactions here
    // For example, parallax effects, progress indicators, etc.
  }
  
  animate() {
    // Update 3D cards
    this.updateCards();
    
    // Update magnetic elements
    this.updateMagneticElements();
    
    // Continue animation loop
    requestAnimationFrame(this.animate.bind(this));
  }
}

// Initialize when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.interactionSystem = new InteractionSystem();
});

// Main.js - Primary script for Eternally Yours
// This script initializes all systems and handles global functionality

document.addEventListener('DOMContentLoaded', () => {
  // Initialize navigation functionality
  initNavigation();
  
  // Initialize form validation and submission
  initForms();
});

function initNavigation() {
  const nav = document.querySelector('.main-navigation');
  
  // Handle navigation visibility on scroll
  if (nav) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }
    });
  }
}

function initForms() {
  const forms = document.querySelectorAll('form');
  
  forms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Simple validation
      let isValid = true;
      const requiredFields = form.querySelectorAll('[required]');
      
      requiredFields.forEach(field => {
        if (!field.value.trim()) {
          isValid = false;
          field.classList.add('error');
        } else {
          field.classList.remove('error');
        }
      });
      
      if (isValid) {
        // Show success message
        const submitButton = form.querySelector('[type="submit"]');
        const originalText = submitButton.textContent;
        
        submitButton.disabled = true;
        submitButton.textContent = 'Sending...';
        
        // Simulate form submission
        setTimeout(() => {
          form.reset();
          submitButton.textContent = 'Sent Successfully!';
          
          setTimeout(() => {
            submitButton.disabled = false;
            submitButton.textContent = originalText;
          }, 2000);
        }, 1500);
      }
    });
  });
}
