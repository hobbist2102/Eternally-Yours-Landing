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
  initLuxuryCardEffects();
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
  
  // Add staggered reveal animations for lists and groups
  const staggeredGroups = document.querySelectorAll('[data-stagger="true"]');
  staggeredGroups.forEach(group => {
    const children = Array.from(group.children);
    const baseDelay = parseInt(group.dataset.staggerDelay || 100);
    
    children.forEach((child, index) => {
      child.style.opacity = '0';
      child.style.transform = 'translateY(20px)';
      child.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      
      // Add to observer with staggered delay
      setTimeout(() => {
        observer.observe(child);
      }, index * baseDelay);
    });
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
        
        // Enhanced depth effect for section content
        const contentElements = section.querySelectorAll('[data-depth]');
        contentElements.forEach(element => {
          const depth = parseFloat(element.dataset.depth) || 0.1;
          const elementTop = element.offsetTop + section.offsetTop;
          const elementProgress = (scrollY - elementTop + window.innerHeight) / window.innerHeight;
          
          if (elementProgress > 0 && elementProgress < 1.5) {
            const moveY = (elementProgress - 0.5) * depth * 100;
            element.style.transform = `translate3D(0, ${moveY}px, 0)`;
          }
        });
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
    
    // Multi-layer parallax for cards and features
    const cardContainers = document.querySelectorAll('.challenge-cards, .features-showcase, .transport-features, .communication-cards');
    cardContainers.forEach(container => {
      const containerTop = container.offsetTop;
      const containerHeight = container.offsetHeight;
      const containerProgress = (scrollY + window.innerHeight - containerTop) / (containerHeight + window.innerHeight);
      
      if (containerProgress > 0 && containerProgress < 1) {
        const cards = container.querySelectorAll('.challenge-card, .feature-card, .transport-feature, .communication-card');
        
        cards.forEach((card, index) => {
          // Create staggered movement based on index
          const staggerFactor = index * 0.1;
          const moveY = (containerProgress - 0.5) * 30 * (1 + staggerFactor);
          const moveX = Math.sin(containerProgress * Math.PI) * 10 * (index % 2 === 0 ? 1 : -1);
          const rotate = Math.sin(containerProgress * Math.PI) * 2 * (index % 2 === 0 ? 1 : -1);
          
          card.style.transform = `translate3D(${moveX}px, ${moveY}px, 0) rotate(${rotate}deg)`;
        });
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
      
      // Add subtle light effect following cursor
      const lightEffect = heroSection.querySelector('.light-effect') || document.createElement('div');
      if (!heroSection.querySelector('.light-effect')) {
        lightEffect.classList.add('light-effect');
        heroSection.appendChild(lightEffect);
      }
      
      lightEffect.style.left = `${x}px`;
      lightEffect.style.top = `${y}px`;
    }
    
    // Add subtle floating animation to hero content
    const heroContent = heroSection.querySelector('.hero-content');
    if (heroContent) {
      function animateHeroContent() {
        const time = Date.now() / 2000;
        const floatY = Math.sin(time) * 10;
        const floatRotateX = Math.sin(time * 0.7) * 1;
        const floatRotateY = Math.cos(time * 0.5) * 1;
        
        heroContent.style.transform = `perspective(1000px) translateY(${floatY}px) rotateX(${floatRotateX}deg) rotateY(${floatRotateY}deg)`;
        
        requestAnimationFrame(animateHeroContent);
      }
      
      animateHeroContent();
    }
  }
  
  // Initialize parallax positions on load
  updateParallaxPositions(window.scrollY);
  
  // Add scroll-triggered reveal animations for sections
  const sections = document.querySelectorAll('section');
  sections.forEach(section => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        section.classList.add('section-visible');
        observer.unobserve(section);
      }
    }, { threshold: 0.2 });
    
    observer.observe(section);
  });
}

// Micro-interactions for buttons, cards, and UI elements
function initMicroInteractions() {
  // Magnetic buttons with enhanced hover effects
  const magneticButtons = document.querySelectorAll('.btn-primary, .btn-secondary, .nav-link.cta');
  
  magneticButtons.forEach(button => {
    // Add shine element if not exists
    if (!button.querySelector('.btn-shine')) {
      const shine = document.createElement('span');
      shine.classList.add('btn-shine');
      button.appendChild(shine);
    }
    
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
      const shine = button.querySelector('.btn-shine');
      if (shine) {
        shine.style.opacity = '1';
        shine.style.left = `${x}px`;
        shine.style.top = `${y}px`;
      }
      
      // Add subtle shadow movement
      button.style.boxShadow = `${deltaX * 5}px ${deltaY * 5}px 15px rgba(0, 0, 0, 0.2)`;
    });
    
    button.addEventListener('mouseleave', () => {
      // Reset position with smooth transition
      button.style.transform = 'translate(0, 0)';
      button.style.boxShadow = '';
      
      // Fade out shine
      const shine = button.querySelector('.btn-shine');
      if (shine) {
        shine.style.opacity = '0';
      }
    });
    
    // Add click effect
    button.addEventListener('mousedown', () => {
      button.style.transform = 'translate(0, 2px)';
      button.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.2)';
    });
    
    button.addEventListener('mouseup', () => {
      button.style.transform = 'translate(0, 0)';
      button.style.boxShadow = '';
    });
  });
  
  // Enhanced WhatsApp message animation
  animateWhatsAppMessages();
  
  // Add subtle hover effects to navigation links
  const navLinks = document.querySelectorAll('.nav-link:not(.cta)');
  navLinks.forEach(link => {
    link.addEventListener('mouseenter', () => {
      link.style.transform = 'translateY(-2px)';
    });
    
    link.addEventListener('mouseleave', () => {
      link.style.transform = 'translateY(0)';
    });
  });
  
  // Add subtle animations to icons
  const icons = document.querySelectorAll('.card-icon, .feature-icon, .transport-icon, .communication-icon');
  icons.forEach(icon => {
    // Subtle pulse animation
    function pulseAnimation() {
      const time = Date.now() / 1000;
      const scale = 1 + Math.sin(time) * 0.05;
      
      icon.style.transform = `scale(${scale})`;
      
      requestAnimationFrame(pulseAnimation);
    }
    
    pulseAnimation();
  });
}

// Enhanced luxury card effects with 3D transformations and dynamic lighting
function initLuxuryCardEffects() {
  // Enhanced 3D Card tilt effect
  const tiltCards = document.querySelectorAll('.challenge-card, .feature-card, .transport-feature, .communication-card');
  
  tiltCards.forEach(card => {
    // Add glare element if not exists
    if (!card.querySelector('.card-glare')) {
      const glare = document.createElement('div');
      glare.classList.add('card-glare');
      card.appendChild(glare);
    }
    
    // Track if mouse is over card
    let isHovering = false;
    
    // Add subtle floating animation when not hovering
    function startFloatingAnimation() {
      if (!isHovering) {
        const time = Date.now() / 1000;
        const floatY = Math.sin(time) * 5;
        const floatRotateX = Math.sin(time * 1.5) * 2;
        const floatRotateY = Math.cos(time * 2) * 2;
        
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
      const cardContent = card.querySelector('.card-content, .feature-content, .transport-content, .communication-content');
      const cardIcon = card.querySelector('.card-icon, .feature-icon, .transport-icon, .communication-icon');
      const cardTitle = card.querySelector('.card-title, .feature-title, .transport-title, .communication-title');
      const cardDescription = card.querySelector('.card-description, .feature-description, .transport-description, .communication-description');
      
      if (cardContent) {
        cardContent.style.transform = `translateZ(20px)`;
      }
      
      if (cardIcon) {
        cardIcon.style.transform = `translateZ(40px) translateX(${deltaX * 10}px) translateY(${deltaY * 10}px)`;
        cardIcon.style.textShadow = `${-deltaX * 5}px ${-deltaY * 5}px 5px rgba(0, 0, 0, 0.3)`;
      }
      
      if (cardTitle) {
        cardTitle.style.transform = `translateZ(30px) translateX(${deltaX * 5}px)`;
      }
      
      if (cardDescription) {
        cardDescription.style.transform = `translateZ(20px) translateX(${deltaX * 3}px)`;
      }
      
      // Position glare based on mouse
      const glare = card.querySelector('.card-glare');
      if (glare) {
        const glareX = x / rect.width * 100;
        const glareY = y / rect.height * 100;
        glare.style.background = `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 50%)`;
        glare.style.opacity = '1';
      }
    });
    
    card.addEventListener('mouseleave', () => {
      isHovering = false;
      
      // Reset transforms with smooth transition
      card.style.transition = 'transform 0.5s ease, box-shadow 0.5s ease';
      card.style.boxShadow = '';
      
      const cardContent = card.querySelector('.card-content, .feature-content, .transport-content, .communication-content');
      const cardIcon = card.querySelector('.card-icon, .feature-icon, .transport-icon, .communication-icon');
      const cardTitle = card.querySelector('.card-title, .feature-title, .transport-title, .communication-title');
      const cardDescription = card.querySelector('.card-description, .feature-description, .transport-description, .communication-description');
      
      if (cardContent) {
        cardContent.style.transform = 'translateZ(0)';
      }
      
      if (cardIcon) {
        cardIcon.style.transform = 'translateZ(0)';
        cardIcon.style.textShadow = 'none';
      }
      
      if (cardTitle) {
        cardTitle.style.transform = 'translateZ(0)';
      }
      
      if (cardDescription) {
        cardDescription.style.transform = 'translateZ(0)';
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
    
    // After all messages, show typing indicator again
    setTimeout(() => {
      if (typingIndicator) {
        typingIndicator.style.display = 'flex';
      }
    }, delay);
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
    // Smooth follow with easing
    cursorX += (mouseX - cursorX) * 0.2;
    cursorY += (mouseY - cursorY) * 0.2;
    
    cursorDot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
    cursorCircle.style.transform = `translate(${cursorX}px, ${cursorY}px)`;
    
    requestAnimationFrame(animateCursor);
  }
  
  animateCursor();
  
  // Change cursor style on interactive elements
  const interactiveElements = document.querySelectorAll('a, button, .btn, .nav-link, .card, .feature-card, .transport-feature, .communication-card');
  
  interactiveElements.forEach(element => {
    element.addEventListener('mouseenter', () => {
      cursorCircle.classList.add('expanded');
    });
    
    element.addEventListener('mouseleave', () => {
      cursorCircle.classList.remove('expanded');
    });
  });
  
  // Hide default cursor
  document.body.style.cursor = 'none';
  
  // Show custom cursor
  cursor.style.opacity = '1';
}

// Navigation effects
function initNavigationEffects() {
  const nav = document.querySelector('.main-navigation');
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');
  
  if (!nav) return;
  
  // Change navigation style on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  });
  
  // Mobile navigation toggle
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      navToggle.classList.toggle('active');
      navLinks.classList.toggle('active');
    });
    
    // Close mobile nav when clicking a link
    const links = navLinks.querySelectorAll('.nav-link');
    links.forEach(link => {
      link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        navLinks.classList.remove('active');
      });
    });
  }
  
  // Highlight active section in navigation
  const sections = document.querySelectorAll('section[id]');
  
  window.addEventListener('scroll', () => {
    let current = '';
    const scrollY = window.scrollY;
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 100;
      const sectionHeight = section.offsetHeight;
      
      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });
    
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });
}

// Add smooth scroll for anchor links
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (!targetElement) return;
      
      window.scrollTo({
        top: targetElement.offsetTop,
        behavior: 'smooth'
      });
    });
  });
});
