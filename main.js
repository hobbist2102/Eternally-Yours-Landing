// Main JavaScript file for eternallyyoursrsvp.in
// Initializes and coordinates all scripts and interactions

document.addEventListener('DOMContentLoaded', () => {
  console.log('Eternally Yours - Initializing main script');
  
  // Initialize all components when document is loaded
  initMainScript();
});

// Main initialization function
function initMainScript() {
  // Load icons from FontAwesome
  loadIcons();
  
  // Initialize all components
  setTimeout(() => {
    // These functions are defined in their respective JS files
    if (typeof initWebGLBackground === 'function') initWebGLBackground();
    if (typeof initLoadingSequence === 'function') initLoadingSequence();
    if (typeof initAnimations === 'function') initAnimations();
    if (typeof initInteractions === 'function') initInteractions();
  }, 100);
}

// Load FontAwesome icons
function loadIcons() {
  // Create link element for FontAwesome
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css';
  
  // Append to head
  document.head.appendChild(link);
  
  // Add icon classes to elements
  addIconClasses();
}

// Add icon classes to elements
function addIconClasses() {
  // Challenge section icons
  const challengeIcons = {
    'coordination': 'fa-solid fa-people-group',
    'communication': 'fa-solid fa-comments',
    'logistics': 'fa-solid fa-route',
    'experience': 'fa-solid fa-heart'
  };
  
  // Feature section icons
  const featureIcons = {
    'dashboard': 'fa-solid fa-gauge-high',
    'design': 'fa-solid fa-wand-magic-sparkles',
    'planning': 'fa-solid fa-calendar-check',
    'seamless': 'fa-solid fa-puzzle-piece'
  };
  
  // Transport section icons
  const transportIcons = {
    'family': 'fa-solid fa-users',
    'guest': 'fa-solid fa-user-check',
    'activity': 'fa-solid fa-person-running',
    'notification': 'fa-solid fa-bell'
  };
  
  // Communication section icons
  const commIcons = {
    'personalized': 'fa-solid fa-envelope-open-text',
    'thoughtful': 'fa-solid fa-lightbulb',
    'reminders': 'fa-solid fa-clock'
  };
  
  // Add icons to elements
  addIconToElements('.challenge-card[data-type]', challengeIcons);
  addIconToElements('.feature-card[data-type]', featureIcons);
  addIconToElements('.transport-feature[data-type]', transportIcons);
  addIconToElements('.comm-feature[data-type]', commIcons);
  
  // Add vehicle icons
  addIconToElements('.vehicle[data-type="family"]', {'family': 'fa-solid fa-car'});
  addIconToElements('.vehicle[data-type="guest"]', {'guest': 'fa-solid fa-van-shuttle'});
  addIconToElements('.vehicle[data-type="vendor"]', {'vendor': 'fa-solid fa-truck'});
  
  // Add location icons
  addIconToElements('.location-hotel', {'hotel': 'fa-solid fa-hotel'});
  addIconToElements('.location-venue', {'venue': 'fa-solid fa-glass-cheers'});
  
  // Add WhatsApp interface icons
  document.querySelectorAll('.chat-back').forEach(el => {
    el.innerHTML = '<i class="fas fa-arrow-left"></i>';
  });
  
  document.querySelectorAll('.chat-actions').forEach(el => {
    el.innerHTML = '<i class="fas fa-video"></i><i class="fas fa-phone"></i><i class="fas fa-ellipsis-v"></i>';
  });
  
  document.querySelectorAll('.input-actions').forEach(el => {
    el.innerHTML = '<i class="fas fa-plus"></i><i class="fas fa-camera"></i><i class="fas fa-microphone"></i>';
  });
  
  document.querySelectorAll('.input-send').forEach(el => {
    el.innerHTML = '<i class="fas fa-paper-plane"></i>';
  });
  
  // Add social media icons
  document.querySelectorAll('.social-link').forEach((el, index) => {
    const icons = ['fa-instagram', 'fa-facebook-f', 'fa-twitter'];
    if (index < icons.length) {
      el.innerHTML = `<i class="fab ${icons[index]}"></i>`;
    }
  });
}

// Helper function to add icons to elements
function addIconToElements(selector, iconMap) {
  document.querySelectorAll(selector).forEach(el => {
    const type = el.dataset.type || selector.replace(/[^a-zA-Z0-9]/g, '');
    const iconClass = iconMap[type];
    
    if (iconClass) {
      const iconEl = el.querySelector('.card-icon') || 
                    el.querySelector('.feature-icon') || 
                    document.createElement('div');
      
      if (!el.querySelector('.card-icon') && !el.querySelector('.feature-icon')) {
        iconEl.classList.add(el.classList.contains('challenge-card') || el.classList.contains('feature-card') ? 
                           'card-icon' : 'feature-icon');
        el.prepend(iconEl);
      }
      
      iconEl.innerHTML = `<i class="${iconClass}"></i>`;
    }
  });
}
