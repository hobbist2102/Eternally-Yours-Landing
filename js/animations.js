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

// Enhanced parallax effects for background layers and content
function initParallaxEffects() {
  // Hero section parallax
  const parallaxLayers = document.querySelectorAll('.parallax-layer');
  
  // Listen for scroll events with throttling for performance
  let lastScrollY = window.scrollY;
  let ticking = false;
  
  window.addEventListener('scroll', () => {
    lastScrollY = window.scrollY;
    
    if (!ticking) {
      window.requestAnimationFrame(() => {
        updateParallaxPositions(lastScrollY);
        ticking = false;
      });
      
      ticking = true;
    }
  });
  
  // Update parallax positions based on scroll
  function updateParallaxPositions(scrollY) {
    // Move each layer at different speeds
    parallaxLayers.forEach(layer => {
      const speed = parseFloat(layer.dataset.speed) || 0.1;
      const yPos = -(scrollY * speed);
      
      // Use transform for better performance
      layer.style.transform = `translate3D(0, ${yPos}px, 0)`;
    });
    
    // Parallax for section backgrounds
    const sections = document.querySelectorAll('.section-with-parallax');
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionBottom = sectionTop + sectionHeight;
      
      // Only apply parallax if section is in viewport
      if (scrollY + window.innerHeight > sectionTop && scrollY < sectionBottom) {
        const background = section.querySelector('.section-background');
        if (background) {
          const speed = parseFloat(background.dataset.speed) || 0.05;
          const yPos = (scrollY - sectionTop) * speed;
          background.style.transform = `translate3D(0, ${yPos}px, 0)`;
        }
      }
    });
    
    // Parallax for content elements
    const parallaxContent = document.querySelectorAll('.content-parallax');
    parallaxContent.forEach(element => {
      const elementTop = element.offsetTop;
      const elementHeight = element.offsetHeight;
      const viewportHeight = window.innerHeight;
      
      // Calculate element's position relative to viewport
      const elementPosition = elementTop - scrollY;
      const elementProgress = 1 - (elementPosition + elementHeight) / (viewportHeight + elementHeight);
      
      if (elementProgress > 0 && elementProgress < 1) {
        const speed = parseFloat(element.dataset.speed) || 0.2;
        const direction = element.dataset.direction || 'up';
        let yPos = 0;
        
        if (direction === 'up') {
          yPos = elementProgress * speed * 100;
        } else if (direction === 'down') {
          yPos = -elementProgress * speed * 100;
        }
        
        element.style.transform = `translate3D(0, ${yPos}px, 0)`;
      }
    });
  }
  
  // Mouse movement parallax for hero section
  const heroSection = document.querySelector('.hero-section');
  
  if (heroSection) {
    // Track mouse position with throttling
    let mouseX = 0;
    let mouseY = 0;
    let requestId = null;
    
    heroSection.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      
      if (!requestId) {
        requestId = window.requestAnimationFrame(() => {
          updateMouseParallax(mouseX, mouseY);
          requestId = null;
        });
      }
    });
    
    function updateMouseParallax(x, y) {
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      
      const deltaX = (x - centerX) / centerX;
      const deltaY = (y - centerY) / centerY;
      
      // Move layers based on mouse position
      parallaxLayers.forEach(layer => {
        const speedX = parseFloat(layer.dataset.speedX) || 2;
        const speedY = parseFloat(layer.dataset.speedY) || 2;
        
        const moveX = deltaX * speedX;
        const moveY = deltaY * speedY;
        
        // Use transform for better performance
        layer.style.transform = `translate3D(${moveX}%, ${moveY}%, 0)`;
      });
      
      // Subtle rotation for 3D effect
      const heroContent = heroSection.querySelector('.hero-content');
      if (heroContent) {
        const rotateX = deltaY * -2; // Inverse Y for natural tilt
        const rotateY = deltaX * 2;
        
        heroContent.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
      }
    }
  }
  
  // Initialize parallax positions on load
  updateParallaxPositions(window.scrollY);
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
      // Reset position with smooth transition
      button.style.transform = 'translate(0, 0)';
      
      // Fade out shine
      const shine = button.querySelector('.btn-shine');
      if (shine) {
        shine.style.opacity = '0';
      }
    });
  });
  
  // Enhanced 3D Card tilt effect
  const tiltCards = document.querySelectorAll('.challenge-card, .feature-card');
  
  tiltCards.forEach(card => {
    // Track if mouse is over card
    let isHovering = false;
    
    // Add subtle floating animation when not hovering
    function startFloatingAnimation() {
      if (!isHovering) {
        const floatY = Math.sin(Date.now() / 1000) * 5;
        const floatRotateX = Math.sin(Date.now() / 1500) * 2;
        const floatRotateY = Math.cos(Date.now() / 2000) * 2;
        
        card.style.transform = `perspective(1000px) rotateX(${floatRotateX}deg) rotateY(${floatRotateY}deg) translateY(${floatY}px)`;
        
        requestAnimationFrame(startFloatingAnimation);
      }
    }
    
    startFloatingAnimation();
    
    card.addEventListener('mousemove', (e) => {
      isHovering = true;
      
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
      
      // Apply 3D transform with smooth transition
      card.style.transition = 'transform 0.1s ease-out';
      card.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(1.05, 1.05, 1.05)`;
      
      // Dynamic shadow
      const shadowX = deltaX * 10;
      const shadowY = deltaY * 10;
      card.style.boxShadow = `${shadowX}px ${shadowY}px 30px rgba(0, 0, 0, 0.2), 0 4px 8px rgba(0, 0, 0, 0.1), inset 0 0 0 1px rgba(255, 255, 255, 0.1)`;
      
      // Move card content for enhanced 3D effect
      const cardContent = card.querySelector('.card-content');
      const cardIcon = card.querySelector('.card-icon, .feature-icon');
      
      if (cardContent) {
        cardContent.style.transform = `translateZ(20px)`;
      }
      
      if (cardIcon) {
        cardIcon.style.transform = `translateZ(40px) translateX(${deltaX * 10}px) translateY(${deltaY * 10}px)`;
        cardIcon.style.textShadow = `${-deltaX * 5}px ${-deltaY * 5}px 5px rgba(0, 0, 0, 0.3)`;
      }
      
      // Add highlight effect
      const glare = card.querySelector('.card-glare') || document.createElement('div');
      if (!card.querySelector('.card-glare')) {
        glare.classList.add('card-glare');
        card.appendChild(glare);
      }
      
      // Position glare based on mouse
      const glareX = x / rect.width * 100;
      const glareY = y / rect.height * 100;
      glare.style.background = `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 50%)`;
      glare.style.opacity = '1';
    });
    
    card.addEventListener('mouseleave', () => {
      isHovering = false;
      
      // Reset transforms with smooth transition
      card.style.transition = 'transform 0.5s ease, box-shadow 0.5s ease';
      card.style.boxShadow = 'var(--shadow-md)';
      
      const cardContent = card.querySelector('.card-content');
      const cardIcon = card.querySelector('.card-icon, .feature-icon');
      
      if (cardContent) {
        cardContent.style.transform = 'translateZ(0)';
      }
      
      if (cardIcon) {
        cardIcon.style.transform = 'translateZ(0)';
        cardIcon.style.textShadow = 'none';
      }
      
      // Fade out glare
      const glare = card.querySelector('.card-glare');
      if (glare) {
        glare.style.opacity = '0';
      }
      
      // Resume floating animation
      startFloatingAnimation();
    });
  });
  
  // Enhanced WhatsApp message animation
  animateWhatsAppMessages();
}

// Animate WhatsApp messages with typing indicators and sequential appearance
function animateWhatsAppMessages() {
  const messageBubbles = document.querySelectorAll('.message-bubble');
  const typingIndicator = document.querySelector('.typing-indicator');
  const messageContainer = document.querySelector('.message-bubbles');
  
  if (!messageContainer || messageBubbles.length === 0) return;
  
  // Create typing indicator if it doesn't exist
  if (!typingIndicator && messageContainer) {
    const newTypingIndicator = document.createElement('div');
    newTypingIndicator.classList.add('typing-indicator');
    newTypingIndicator.innerHTML = `
      <span class="dot"></span>
      <span class="dot"></span>
      <span class="dot"></span>
    `;
    newTypingIndicator.style.display = 'none';
    messageContainer.appendChild(newTypingIndicator);
  }
  
  // Hide all messages initially
  messageBubbles.forEach(bubble => {
    bubble.style.opacity = '0';
    bubble.style.transform = 'translateY(20px)';
  });
  
  // Create intersection observer to trigger animation when visible
  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      // Start animation sequence
      showMessagesSequentially();
      // Unobserve after triggering
      observer.unobserve(messageContainer);
    }
  }, { threshold: 0.3 });
  
  // Observe message container
  observer.observe(messageContainer);
  
  // Function to show messages sequentially
  function showMessagesSequentially() {
    const typingIndicator = document.querySelector('.typing-indicator');
    let delay = 1000;
    
    messageBubbles.forEach((bubble, index) => {
      setTimeout(() => {
        // Show typing indicator before guest messages
        if (bubble.classList.contains('guest') && typingIndicator) {
          typingIndicator.style.display = 'flex';
          
          setTimeout(() => {
            typingIndicator.style.display = 'none';
            
            // Show message with animation
            bubble.style.transition = 'opacity 0.3s ease, transform 0.4s ease';
            bubble.style.opacity = '1';
            bubble.style.transform = 'translateY(0)';
            
            // Add subtle bounce effect
            setTimeout(() => {
              bubble.style.transform = 'translateY(-5px)';
              setTimeout(() => {
                bubble.style.transform = 'translateY(0)';
              }, 150);
            }, 300);
            
            // Scroll container to show new message
            messageContainer.scrollTop = messageContainer.scrollHeight;
          }, 1500);
        } else {
          // Show host message with animation
          bubble.style.transition = 'opacity 0.3s ease, transform 0.4s ease';
          bubble.style.opacity = '1';
          bubble.style.transform = 'translateY(0)';
          
          // Add subtle bounce effect
          setTimeout(() => {
            bubble.style.transform = 'translateY(-5px)';
            setTimeout(() => {
              bubble.style.transform = 'translateY(0)';
            }, 150);
          }, 300);
          
          // Scroll container to show new message
          messageContainer.scrollTop = messageContainer.scrollHeight;
        }
      }, delay);
      
      // Increase delay for next message
      delay += bubble.classList.contains('guest') ? 3000 : 1500;
    });
  }
}

// Custom cursor effect
function initCustomCursor() {
  const cursor = document.querySelector('.custom-cursor');
  const cursorDot = document.querySelector('.cursor-dot');
  const cursorCircle = document.querySelector('.cursor-circle');
  
  if (!cursor || !cursorDot || !cursorCircle) return;
  
  // Update cursor position on mouse move with smooth animation
  let mouseX = 0;
  let mouseY = 0;
  let cursorX = 0;
  let cursorY = 0;
  
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });
  
  // Animate cursor with requestAnimationFrame for smooth movement
  function animateCursor() {
    // Calculate smooth movement with easing
    const easeFactor = 0.2;
    cursorX += (mouseX - cursorX) * easeFactor;
    cursorY += (mouseY - cursorY) * easeFactor;
    
    // Apply position with transform for better performance
    cursorDot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
    cursorCircle.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0)`;
    
    requestAnimationFrame(animateCursor);
  }
  
  animateCursor();
  
  // Enhanced hover effects for interactive elements
  const interactiveElements = document.querySelectorAll('a, button, .btn, .nav-link, .feature-card, .challenge-card');
  
  interactiveElements.forEach(element => {
    element.addEventListener('mouseenter', () => {
      // Expand circle and change opacity with smooth transition
      cursorCircle.classList.add('expanded');
      
      // Different effects for different element types
      if (element.classList.contains('btn-primary')) {
        cursorCircle.classList.add('primary');
      } else if (element.classList.contains('feature-card') || element.classList.contains('challenge-card')) {
        cursorCircle.classList.add('card');
      }
    });
    
    element.addEventListener('mouseleave', () => {
      // Reset to default with smooth transition
      cursorCircle.classList.remove('expanded', 'primary', 'card');
    });
  });
  
  // Hide cursor when leaving window
  document.addEventListener('mouseout', (e) => {
    if (e.relatedTarget === null) {
      cursor.classList.add('hidden');
    }
  });
  
  document.addEventListener('mouseover', () => {
    cursor.classList.remove('hidden');
  });
  
  // Add cursor styles if not already present
  if (!document.getElementById('cursor-styles')) {
    const style = document.createElement('style');
    style.id = 'cursor-styles';
    style.textContent = `
      .custom-cursor {
        pointer-events: none;
        position: fixed;
        z-index: 9999;
        mix-blend-mode: difference;
        transition: opacity 0.3s ease;
      }
      
      .custom-cursor.hidden {
        opacity: 0;
      }
      
      .cursor-dot {
        position: fixed;
        width: 8px;
        height: 8px;
        background-color: var(--color-gold-600);
        border-radius: 50%;
        transform: translate(-50%, -50%);
        transition: opacity 0.3s ease;
      }
      
      .cursor-circle {
        position: fixed;
        width: 40px;
        height: 40px;
        border: 1px solid var(--color-gold-600);
        border-radius: 50%;
        transform: translate(-50%, -50%);
        transition: width 0.3s ease, height 0.3s ease, background-color 0.3s ease, border-color 0.3s ease;
      }
      
      .cursor-circle.expanded {
        width: 60px;
        height: 60px;
        background-color: rgba(201, 176, 55, 0.1);
      }
      
      .cursor-circle.primary {
        border-color: var(--color-gold-600);
        background-color: rgba(201, 176, 55, 0.15);
      }
      
      .cursor-circle.card {
        width: 80px;
        height: 80px;
        border-color: var(--color-gold-600);
        background-color: rgba(201, 176, 55, 0.05);
      }
    `;
    document.head.appendChild(style);
  }
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
