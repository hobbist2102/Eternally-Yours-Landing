// interactions.js - Advanced interactive elements for eternallyyoursrsvp.in
// Implements 3D card effects, magnetic buttons, and custom interactions

// Initialize interactions when document is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Interactions will be initialized after loading screen completes
});

// Main interactions initialization
function initInteractions() {
  initTransportVisualization();
  initWhatsAppInteractions();
  initScrollIndicator();
  initFormInteractions();
}

// Transport visualization with animated routes and vehicles
function initTransportVisualization() {
  const mapContainer = document.querySelector('.map-container');
  if (!mapContainer) return;
  
  // Create animated particles for routes
  const routes = document.querySelectorAll('.route');
  
  routes.forEach(route => {
    // Create particles for each route
    for (let i = 0; i < 10; i++) {
      const particle = document.createElement('div');
      particle.classList.add('route-particle');
      
      // Random starting position along the route
      const position = Math.random() * 100;
      particle.style.left = `${position}%`;
      
      // Random size and opacity
      const size = Math.random() * 4 + 2;
      const opacity = Math.random() * 0.5 + 0.3;
      
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      particle.style.opacity = opacity;
      
      // Animation duration
      const duration = Math.random() * 5 + 5;
      particle.style.animationDuration = `${duration}s`;
      
      // Add to route
      route.appendChild(particle);
    }
  });
  
  // Animate vehicles along routes
  const vehicles = document.querySelectorAll('.vehicle');
  
  vehicles.forEach(vehicle => {
    // Add pulse animation to vehicles
    vehicle.classList.add('animate-pulse');
    
    // Create vehicle trail effect
    const trail = document.createElement('div');
    trail.classList.add('vehicle-trail');
    vehicle.appendChild(trail);
  });
  
  // Interactive hover effects for locations
  const locations = document.querySelectorAll('.location');
  
  locations.forEach(location => {
    location.addEventListener('mouseenter', () => {
      location.classList.add('location-highlight');
    });
    
    location.addEventListener('mouseleave', () => {
      location.classList.remove('location-highlight');
    });
  });
}

// WhatsApp interface interactions
function initWhatsAppInteractions() {
  const whatsappFrame = document.querySelector('.whatsapp-frame');
  if (!whatsappFrame) return;
  
  // Simulate typing in input field
  const inputField = whatsappFrame.querySelector('.input-field input');
  const sendButton = whatsappFrame.querySelector('.input-send');
  
  if (inputField && sendButton) {
    // Focus input on click
    inputField.addEventListener('click', () => {
      inputField.focus();
    });
    
    // Send message on enter or button click
    inputField.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' && inputField.value.trim() !== '') {
        sendMessage(inputField.value);
        inputField.value = '';
      }
    });
    
    sendButton.addEventListener('click', () => {
      if (inputField.value.trim() !== '') {
        sendMessage(inputField.value);
        inputField.value = '';
      }
    });
  }
  
  // Function to add new message to chat
  function sendMessage(text) {
    const messageBubbles = document.querySelector('.message-bubbles');
    
    // Create new message element
    const newMessage = document.createElement('div');
    newMessage.classList.add('message-bubble', 'guest');
    
    // Message content
    const messageContent = document.createElement('div');
    messageContent.classList.add('message-content');
    messageContent.innerHTML = `<p>${text}</p>`;
    
    // Message time
    const messageTime = document.createElement('div');
    messageTime.classList.add('message-time');
    
    // Get current time
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    
    messageTime.textContent = `${hours}:${minutes}`;
    
    // Assemble message
    newMessage.appendChild(messageContent);
    newMessage.appendChild(messageTime);
    
    // Add to chat
    messageBubbles.appendChild(newMessage);
    
    // Scroll to bottom
    messageBubbles.scrollTop = messageBubbles.scrollHeight;
    
    // Simulate response after delay
    setTimeout(() => {
      // Show typing indicator
      const typingIndicator = document.createElement('div');
      typingIndicator.classList.add('typing-indicator');
      typingIndicator.innerHTML = '<span></span><span></span><span></span>';
      
      messageBubbles.appendChild(typingIndicator);
      messageBubbles.scrollTop = messageBubbles.scrollHeight;
      
      // Hide typing indicator and show response after delay
      setTimeout(() => {
        typingIndicator.remove();
        
        // Create response message
        const responseMessage = document.createElement('div');
        responseMessage.classList.add('message-bubble', 'host');
        
        // Response content
        const responseContent = document.createElement('div');
        responseContent.classList.add('message-content');
        responseContent.innerHTML = `<p>Thank you for your message! Our team will assist you shortly with your wedding transportation needs.</p>`;
        
        // Response time
        const responseTime = document.createElement('div');
        responseTime.classList.add('message-time');
        
        // Get current time
        const responseNow = new Date();
        const responseHours = responseNow.getHours().toString().padStart(2, '0');
        const responseMinutes = responseNow.getMinutes().toString().padStart(2, '0');
        
        responseTime.innerHTML = `${responseHours}:${responseMinutes} <i class="fas fa-check-double"></i>`;
        
        // Assemble response
        responseMessage.appendChild(responseContent);
        responseMessage.appendChild(responseTime);
        
        // Add to chat
        messageBubbles.appendChild(responseMessage);
        
        // Scroll to bottom
        messageBubbles.scrollTop = messageBubbles.scrollHeight;
      }, 2000);
    }, 1000);
  }
}

// Scroll indicator animation and interaction
function initScrollIndicator() {
  const scrollIndicator = document.querySelector('.scroll-indicator');
  if (!scrollIndicator) return;
  
  scrollIndicator.addEventListener('click', () => {
    // Scroll to next section
    const heroSection = document.querySelector('.hero-section');
    const nextSection = heroSection.nextElementSibling;
    
    if (nextSection) {
      window.scrollTo({
        top: nextSection.offsetTop,
        behavior: 'smooth'
      });
    }
  });
  
  // Hide scroll indicator when scrolling down
  window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
      scrollIndicator.style.opacity = '0';
      scrollIndicator.style.pointerEvents = 'none';
    } else {
      scrollIndicator.style.opacity = '0.7';
      scrollIndicator.style.pointerEvents = 'auto';
    }
  });
}

// Form interactions and validation
function initFormInteractions() {
  const forms = document.querySelectorAll('form');
  
  forms.forEach(form => {
    const inputs = form.querySelectorAll('input, textarea');
    
    inputs.forEach(input => {
      // Label animation
      const label = input.previousElementSibling;
      
      if (label && label.tagName === 'LABEL') {
        // Initial state check
        if (input.value !== '') {
          label.classList.add('active');
        }
        
        // Focus event
        input.addEventListener('focus', () => {
          label.classList.add('active');
        });
        
        // Blur event
        input.addEventListener('blur', () => {
          if (input.value === '') {
            label.classList.remove('active');
          }
        });
      }
      
      // Input validation
      input.addEventListener('input', () => {
        validateInput(input);
      });
    });
    
    // Form submission
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Validate all inputs
      let isValid = true;
      
      inputs.forEach(input => {
        if (!validateInput(input)) {
          isValid = false;
        }
      });
      
      if (isValid) {
        // Show success message
        const successMessage = document.createElement('div');
        successMessage.classList.add('form-success');
        successMessage.textContent = 'Thank you! Your message has been sent successfully.';
        
        form.appendChild(successMessage);
        
        // Reset form after delay
        setTimeout(() => {
          form.reset();
          successMessage.remove();
          
          // Reset labels
          const labels = form.querySelectorAll('label');
          labels.forEach(label => {
            label.classList.remove('active');
          });
        }, 3000);
      }
    });
  });
  
  // Input validation function
  function validateInput(input) {
    const value = input.value.trim();
    const type = input.type;
    const required = input.hasAttribute('required');
    
    // Clear previous error
    const errorElement = input.nextElementSibling;
    if (errorElement && errorElement.classList.contains('input-error')) {
      errorElement.remove();
    }
    
    // Check if required field is empty
    if (required && value === '') {
      showError(input, 'This field is required');
      return false;
    }
    
    // Email validation
    if (type === 'email' && value !== '') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        showError(input, 'Please enter a valid email address');
        return false;
      }
    }
    
    // Phone validation
    if (type === 'tel' && value !== '') {
      const phoneRegex = /^\+?[0-9\s\-\(\)]{8,20}$/;
      if (!phoneRegex.test(value)) {
        showError(input, 'Please enter a valid phone number');
        return false;
      }
    }
    
    return true;
  }
  
  // Show error message
  function showError(input, message) {
    const errorElement = document.createElement('div');
    errorElement.classList.add('input-error');
    errorElement.textContent = message;
    
    // Insert after input
    input.parentNode.insertBefore(errorElement, input.nextSibling);
    
    // Highlight input
    input.classList.add('input-invalid');
    
    // Remove error on input
    input.addEventListener('input', () => {
      input.classList.remove('input-invalid');
      if (errorElement.parentNode) {
        errorElement.remove();
      }
    }, { once: true });
  }
}
