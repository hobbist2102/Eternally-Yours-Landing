// animations.js - Advanced animation system for Eternally Yours
// This script handles all scroll-triggered animations, micro-interactions,
// and sophisticated motion effects throughout the site

class AnimationSystem {
  constructor() {
    // Store animation elements
    this.animatedElements = [];
    this.scrollTriggers = [];
    this.parallaxElements = [];
    
    // Animation configuration
    this.config = {
      threshold: 0.2,
      rootMargin: '0px',
      parallaxStrength: 0.15,
      staggerDelay: 0.08
    };
    
    // Initialize
    this.init();
  }
  
  init() {
    // Wait for DOM and GSAP to be loaded
    if (typeof gsap === 'undefined') {
      console.error('GSAP not loaded');
      return;
    }
    
    // Register ScrollTrigger plugin if available
    if (gsap.plugins && gsap.plugins.ScrollTrigger) {
      gsap.registerPlugin(gsap.plugins.ScrollTrigger);
    }
    
    // Initialize animations once loading is complete
    window.addEventListener('load', () => {
      // Delay to ensure all resources are loaded
      setTimeout(() => {
        this.setupLoadingSequence();
        this.setupScrollAnimations();
        this.setupParallaxEffects();
        this.setupMicroInteractions();
      }, 100);
    });
  }
  
  setupLoadingSequence() {
    const loadingScreen = document.querySelector('.loading-screen');
    const contentWrapper = document.querySelector('.content-wrapper');
    const loadingBar = document.querySelector('.loading-bar-fill');
    const loadingPercentage = document.querySelector('.loading-percentage');
    const loadingLogo = document.querySelector('.loading-logo');
    
    if (!loadingScreen || !contentWrapper) return;
    
    // Simulate loading progress
    const duration = 2.5;
    const steps = 20;
    let progress = 0;
    
    // Initial animation for loading logo
    gsap.from(loadingLogo, {
      opacity: 0,
      y: 20,
      duration: 0.8,
      ease: 'power3.out'
    });
    
    // Loading progress animation
    const loadingInterval = setInterval(() => {
      progress += 100 / steps;
      if (progress >= 100) {
        progress = 100;
        clearInterval(loadingInterval);
        
        // Complete loading sequence
        this.completeLoading(loadingScreen, contentWrapper);
      }
      
      // Update loading bar and percentage
      if (loadingBar) loadingBar.style.width = `${progress}%`;
      if (loadingPercentage) loadingPercentage.textContent = `${Math.round(progress)}%`;
    }, duration * 1000 / steps);
  }
  
  completeLoading(loadingScreen, contentWrapper) {
    // Reveal content with elegant transition
    gsap.to(loadingScreen, {
      opacity: 0,
      duration: 0.8,
      ease: 'power3.inOut',
      onComplete: () => {
        loadingScreen.style.display = 'none';
        
        // Reveal content
        contentWrapper.style.opacity = 1;
        
        // Animate hero section elements
        this.animateHeroSection();
        
        // Initialize scroll-based animations
        this.initScrollObserver();
      }
    });
  }
  
  animateHeroSection() {
    const heroTitle = document.querySelector('.hero-title');
    const heroSubtitle = document.querySelector('.hero-subtitle');
    const heroDescription = document.querySelector('.hero-description');
    const heroCta = document.querySelector('.hero-cta');
    const scrollIndicator = document.querySelector('.scroll-indicator');
    
    // Create a timeline for hero animations
    const tl = gsap.timeline({
      defaults: { ease: 'power3.out' }
    });
    
    // Split text for more sophisticated animation if possible
    if (heroTitle) {
      const titleLines = heroTitle.querySelectorAll('.title-line');
      
      if (titleLines.length) {
        tl.fromTo(titleLines, 
          { y: 50, opacity: 0 },
          { y: 0, opacity: 1, duration: 1.2, stagger: 0.2 },
          0
        );
      } else {
        tl.fromTo(heroTitle,
          { y: 50, opacity: 0 },
          { y: 0, opacity: 1, duration: 1.2 },
          0
        );
      }
    }
    
    // Subtitle animation
    if (heroSubtitle) {
      tl.fromTo(heroSubtitle,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 1 },
        0.4
      );
    }
    
    // Description animation
    if (heroDescription) {
      tl.fromTo(heroDescription,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 1 },
        0.6
      );
    }
    
    // CTA buttons animation
    if (heroCta) {
      const ctaButtons = heroCta.querySelectorAll('.btn');
      
      tl.fromTo(ctaButtons,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.15 },
        0.8
      );
    }
    
    // Scroll indicator animation
    if (scrollIndicator) {
      tl.fromTo(scrollIndicator,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 0.7, duration: 0.8 },
        1.2
      );
    }
  }
  
  setupScrollAnimations() {
    // Collect all elements to animate on scroll
    this.collectAnimatedElements();
    
    // Setup section-specific animations
    this.setupChallengeCardsAnimation();
    this.setupFeatureCardsAnimation();
    this.setupTransportVisualizationAnimation();
    this.setupCommunicationAnimation();
  }
  
  collectAnimatedElements() {
    // Find all elements with animation classes
    const fadeElements = document.querySelectorAll('.fade-in');
    const scaleElements = document.querySelectorAll('.scale-in');
    const slideLeftElements = document.querySelectorAll('.slide-in-left');
    const slideRightElements = document.querySelectorAll('.slide-in-right');
    
    // Add to animated elements array
    this.animatedElements = [
      ...Array.from(fadeElements).map(el => ({ element: el, animation: 'fade' })),
      ...Array.from(scaleElements).map(el => ({ element: el, animation: 'scale' })),
      ...Array.from(slideLeftElements).map(el => ({ element: el, animation: 'slideLeft' })),
      ...Array.from(slideRightElements).map(el => ({ element: el, animation: 'slideRight' }))
    ];
    
    // Add section headers for consistent animation
    const sectionHeaders = document.querySelectorAll('.section-header');
    sectionHeaders.forEach(header => {
      if (!this.animatedElements.some(item => item.element === header)) {
        this.animatedElements.push({ element: header, animation: 'fade' });
      }
    });
    
    // Add section descriptions
    const sectionDescriptions = document.querySelectorAll('.section-description');
    sectionDescriptions.forEach(desc => {
      if (!this.animatedElements.some(item => item.element === desc)) {
        this.animatedElements.push({ element: desc, animation: 'fade' });
      }
    });
  }
  
  initScrollObserver() {
    // Create intersection observer for scroll animations
    const options = {
      threshold: this.config.threshold,
      rootMargin: this.config.rootMargin
    };
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Find the element in our collection
          const animItem = this.animatedElements.find(item => item.element === entry.target);
          if (animItem) {
            // Apply the appropriate animation
            this.animateElement(animItem.element, animItem.animation);
            // Unobserve after animation
            observer.unobserve(entry.target);
          }
        }
      });
    }, options);
    
    // Observe all animated elements
    this.animatedElements.forEach(item => {
      observer.observe(item.element);
    });
  }
  
  animateElement(element, animationType) {
    // Add visible class for CSS transitions
    element.classList.add('visible');
    
    // Apply GSAP animations for more control
    switch (animationType) {
      case 'fade':
        gsap.fromTo(element, 
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }
        );
        break;
        
      case 'scale':
        gsap.fromTo(element, 
          { opacity: 0, scale: 0.9 },
          { opacity: 1, scale: 1, duration: 1, ease: 'power3.out' }
        );
        break;
        
      case 'slideLeft':
        gsap.fromTo(element, 
          { opacity: 0, x: -50 },
          { opacity: 1, x: 0, duration: 1, ease: 'power3.out' }
        );
        break;
        
      case 'slideRight':
        gsap.fromTo(element, 
          { opacity: 0, x: 50 },
          { opacity: 1, x: 0, duration: 1, ease: 'power3.out' }
        );
        break;
    }
  }
  
  setupChallengeCardsAnimation() {
    const cards = document.querySelectorAll('.challenge-card');
    if (!cards.length) return;
    
    // Create scroll trigger for staggered animation
    if (gsap.plugins && gsap.plugins.ScrollTrigger) {
      gsap.from(cards, {
        scrollTrigger: {
          trigger: cards[0].parentElement,
          start: 'top 80%'
        },
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: this.config.staggerDelay,
        ease: 'power3.out'
      });
    }
  }
  
  setupFeatureCardsAnimation() {
    const cards = document.querySelectorAll('.feature-card');
    if (!cards.length) return;
    
    // Create scroll trigger for staggered animation
    if (gsap.plugins && gsap.plugins.ScrollTrigger) {
      gsap.from(cards, {
        scrollTrigger: {
          trigger: cards[0].parentElement,
          start: 'top 80%'
        },
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: this.config.staggerDelay,
        ease: 'power3.out'
      });
    }
    
    // Add hover animations for each card
    cards.forEach(card => {
      card.addEventListener('mouseenter', () => {
        gsap.to(card, {
          y: -5,
          scale: 1.02,
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)',
          duration: 0.3,
          ease: 'power2.out'
        });
      });
      
      card.addEventListener('mouseleave', () => {
        gsap.to(card, {
          y: 0,
          scale: 1,
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
          duration: 0.5,
          ease: 'power2.out'
        });
      });
    });
  }
  
  setupTransportVisualizationAnimation() {
    const visualization = document.querySelector('.transport-visualization');
    const features = document.querySelectorAll('.transport-feature');
    
    if (!visualization || !features.length) return;
    
    // Create scroll trigger for visualization
    if (gsap.plugins && gsap.plugins.ScrollTrigger) {
      gsap.from(visualization, {
        scrollTrigger: {
          trigger: visualization,
          start: 'top 80%'
        },
        opacity: 0,
        scale: 0.95,
        duration: 1,
        ease: 'power3.out'
      });
      
      // Staggered animation for features
      gsap.from(features, {
        scrollTrigger: {
          trigger: features[0].parentElement,
          start: 'top 80%'
        },
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: this.config.staggerDelay,
        ease: 'power3.out'
      });
    }
  }
  
  setupCommunicationAnimation() {
    const messageBubbles = document.querySelectorAll('.message-bubble');
    
    if (!messageBubbles.length) return;
    
    // Create scroll trigger for staggered message animation
    if (gsap.plugins && gsap.plugins.ScrollTrigger) {
      gsap.from(messageBubbles, {
        scrollTrigger: {
          trigger: messageBubbles[0].parentElement,
          start: 'top 80%'
        },
        y: 20,
        opacity: 0,
        duration: 0.6,
        stagger: 0.15,
        ease: 'power3.out'
      });
    }
  }
  
  setupParallaxEffects() {
    // Find elements with parallax attributes
    const parallaxElements = document.querySelectorAll('[data-parallax]');
    
    parallaxElements.forEach(element => {
      const depth = parseFloat(element.getAttribute('data-parallax-depth') || 0.2);
      this.parallaxElements.push({ element, depth });
    });
    
    // Add scroll listener for parallax effect
    if (this.parallaxElements.length) {
      window.addEventListener('scroll', this.handleParallaxScroll.bind(this));
    }
  }
  
  handleParallaxScroll() {
    const scrollY = window.scrollY;
    
    this.parallaxElements.forEach(item => {
      const yOffset = scrollY * item.depth * this.config.parallaxStrength;
      gsap.set(item.element, { y: yOffset });
    });
  }
  
  setupMicroInteractions() {
    this.setupNavInteractions();
    this.setupButtonInteractions();
    this.setupCustomCursor();
  }
  
  setupNavInteractions() {
    const nav = document.querySelector('.main-navigation');
    const navLinks = document.querySelectorAll('.nav-link');
    
    if (!nav) return;
    
    // Navigation scroll effect
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }
    });
    
    // Nav link hover effects
    navLinks.forEach(link => {
      link.addEventListener('mouseenter', () => {
        gsap.to(link, {
          scale: 1.05,
          duration: 0.3,
          ease: 'power2.out'
        });
      });
      
      link.addEventListener('mouseleave', () => {
        gsap.to(link, {
          scale: 1,
          duration: 0.3,
          ease: 'power2.out'
        });
      });
    });
  }
  
  setupButtonInteractions() {
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(button => {
      // Magnetic effect on hover
      button.addEventListener('mousemove', (e) => {
        const rect = button.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const deltaX = (x - centerX) / centerX;
        const deltaY = (y - centerY) / centerY;
        
        gsap.to(button, {
          x: deltaX * 10,
          y: deltaY * 5,
          duration: 0.3,
          ease: 'power2.out'
        });
      });
      
      // Reset position on mouse leave
      button.addEventListener('mouseleave', () => {
        gsap.to(button, {
          x: 0,
          y: 0,
          duration: 0.5,
          ease: 'elastic.out(1, 0.3)'
        });
      });
      
      // Click effect
      button.addEventListener('mousedown', () => {
        gsap.to(button, {
          scale: 0.95,
          duration: 0.1,
          ease: 'power2.out'
        });
      });
      
      button.addEventListener('mouseup', () => {
        gsap.to(button, {
          scale: 1,
          duration: 0.3,
          ease: 'elastic.out(1, 0.3)'
        });
      });
    });
  }
  
  setupCustomCursor() {
    const cursor = document.querySelector('.custom-cursor');
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorCircle = document.querySelector('.cursor-circle');
    
    if (!cursor || !cursorDot || !cursorCircle) return;
    
    // Update cursor position
    document.addEventListener('mousemove', (e) => {
      gsap.to(cursorDot, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.1,
        ease: 'power2.out'
      });
      
      gsap.to(cursorCircle, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.3,
        ease: 'power2.out'
      });
    });
    
    // Hover effect for interactive elements
    const interactiveElements = document.querySelectorAll('a, button, .btn, .feature-card, .challenge-card');
    
    interactiveElements.forEach(element => {
      element.addEventListener('mouseenter', () => {
        cursor.classList.add('cursor-hover');
      });
      
      element.addEventListener('mouseleave', () => {
        cursor.classList.remove('cursor-hover');
      });
    });
    
    // Click effect
    document.addEventListener('mousedown', () => {
      cursor.classList.add('cursor-click');
    });
    
    document.addEventListener('mouseup', () => {
      cursor.classList.remove('cursor-click');
    });
    
    // Hide cursor when it leaves the window
    document.addEventListener('mouseleave', () => {
      cursor.style.opacity = 0;
    });
    
    document.addEventListener('mouseenter', () => {
      cursor.style.opacity = 1;
    });
  }
}

// Initialize when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.animationSystem = new AnimationSystem();
});
