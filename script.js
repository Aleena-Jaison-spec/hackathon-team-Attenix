/* ============================================
   KRISHI AI - IVR SIMULATION SCRIPT
   ============================================ */

// ============================================
// STATE MANAGEMENT
// ============================================

const state = {
  currentPage: 'landing',
  conversationStarted: false,
  currentInputValue: '',
  userInputHistory: [],
  ivrStage: 'initial',
  slideshowIndex: 0,
  slideshowInterval: null
};

// ============================================
// IMAGE SLIDESHOW DATA
// ============================================

const slideshowImages = [
  'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 600"><defs><linearGradient id="g1" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%25" style="stop-color:%232da65a;stop-opacity:1" /><stop offset="100%25" style="stop-color:%231b5e3e;stop-opacity:1" /></linearGradient></defs><rect fill="url(%23g1)" width="1200" height="600"/><circle cx="150" cy="150" r="80" fill="%2352b788" opacity="0.3"/><circle cx="1050" cy="450" r="120" fill="%23a8d5ba" opacity="0.2"/><path d="M 0 400 Q 300 300 600 400 T 1200 400 L 1200 600 L 0 600 Z" fill="%23c8e6c9" opacity="0.5"/></svg>',
  'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 600"><defs><linearGradient id="g2" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%25" style="stop-color:%231b5e3e;stop-opacity:1" /><stop offset="100%25" style="stop-color:%23267A3A;stop-opacity:1" /></linearGradient></defs><rect fill="url(%23g2)" width="1200" height="600"/><rect x="100" y="100" width="300" height="400" fill="%23A8D5BA" opacity="0.5"/><rect x="800" y="200" width="250" height="300" fill="%2352b788" opacity="0.4"/><circle cx="600" cy="300" r="100" fill="%23FFD54F" opacity="0.6"/></svg>',
  'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 600"><defs><linearGradient id="g3" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%25" style="stop-color:%2352b788;stop-opacity:1" /><stop offset="100%25" style="stop-color:%232da65a;stop-opacity:1" /></linearGradient></defs><rect fill="url(%23g3)" width="1200" height="600"/><path d="M 0 350 Q 300 250 600 350 T 1200 350 L 1200 600 L 0 600 Z" fill="%23a8d5ba" opacity="0.6"/><polygon points="300,200 500,400 100,400" fill="%23FFD54F" opacity="0.7"/><polygon points="900,150 1100,350 700,350" fill="%23FFA726" opacity="0.5"/></svg>',
  'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 600"><defs><pattern id="p1" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="50" cy="50" r="45" fill="none" stroke="%234CAF50" stroke-width="1" opacity="0.3"/></pattern><linearGradient id="g4" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%25" style="stop-color:%23267A3A;stop-opacity:1" /><stop offset="100%25" style="stop-color:%231b5e3e;stop-opacity:1" /></linearGradient></defs><rect fill="url(%23g4)" width="1200" height="600"/><rect fill="url(%23p1)" width="1200" height="600"/><ellipse cx="200" cy="400" rx="150" ry="80" fill="%2334a853" opacity="0.4"/><ellipse cx="1000" cy="200" rx="200" ry="100" fill="%2381c784" opacity="0.3"/></svg>'
];

// ============================================
// AI RESPONSE LOGIC
// ============================================

const aiResponses = {
  '1': 'You selected Crop Advisory. Please choose: 1 for Rice, 2 for Wheat, 3 for Maize.',
  '2': 'You selected Weather Updates. Today\'s forecast is sunny with 30°C and low humidity.',
  '3': 'You selected Fertilizer Guidance. Organic fertilizers are recommended for better yield and sustainable farming.',
  '4': 'You selected Market Prices. Rice price is ₹2,200 per quintal, Wheat is ₹2,100 per quintal.',
  '5': 'You selected Irrigation Tips. Water your crops early morning or evening for best results.',
  '6': 'You selected Pest Management. Neem oil spray is effective for common crop pests. Apply every 7 days.',
  '7': 'You selected Soil Health. Regular soil testing helps determine nutrient deficiencies. Test annually.',
  '8': 'You selected Government Schemes. Several schemes available for crop insurance and subsidies. Contact your local officer.',
  '9': 'You selected Seed Information. Use certified seeds from authorized dealers for best germination rates.',
  '0': 'Connecting you to the live agricultural officer. Please wait... 🔄',
  '*': 'You pressed star. Press any number for our menu or 0 to speak with an officer.',
  '#': 'Ending call. Thank you for using Krishi AI. Goodbye! 👋'
};

const initialGreeting = 'Welcome to Krishi AI - Your Agricultural Assistant! Press a number from 1-9 for support, press 0 to speak with an officer, or # to exit.';

// ============================================
// PAGE NAVIGATION
// ============================================

function showPage(pageName) {
  // Hide all pages
  document.querySelectorAll('.page').forEach(page => {
    page.classList.remove('active');
  });

  // Show target page
  const targetPage = document.getElementById(pageName === 'landing' ? 'landingPage' : 'ivrPage');
  if (targetPage) {
    targetPage.classList.add('active');
  }

  state.currentPage = pageName;
}

// ============================================
// IMAGE SLIDESHOW FUNCTIONALITY
// ============================================

function initializeSlideshow() {
  const demoSlideshow = document.getElementById('demoSlideshow');
  
  // Create image elements
  slideshowImages.forEach((imgSrc, index) => {
    const img = document.createElement('img');
    img.className = 'slideshow-image';
    if (index === 0) img.classList.add('active');
    img.src = imgSrc;
    demoSlideshow.appendChild(img);
  });

  // Start slideshow
  startSlideshow();
}

function startSlideshow() {
  if (state.slideshowInterval) clearInterval(state.slideshowInterval);

  state.slideshowInterval = setInterval(() => {
    updateSlideshow();
  }, 500); // Change every 0.5 seconds
}

function updateSlideshow() {
  const images = document.querySelectorAll('.slideshow-image');
  
  // Remove active from current
  images.forEach(img => img.classList.remove('active'));

  // Move to next
  state.slideshowIndex = (state.slideshowIndex + 1) % images.length;
  images[state.slideshowIndex].classList.add('active');
}

function stopSlideshow() {
  if (state.slideshowInterval) {
    clearInterval(state.slideshowInterval);
    state.slideshowInterval = null;
  }
}

// ============================================
// MODAL FUNCTIONALITY
// ============================================

const modal = document.getElementById('instructionsModal');
const instructionsBtn = document.getElementById('instructionsBtn');
const closeBtn = document.querySelector('.close');

instructionsBtn.addEventListener('click', () => {
  modal.classList.add('show');
});

closeBtn.addEventListener('click', () => {
  modal.classList.remove('show');
});

window.addEventListener('click', (event) => {
  if (event.target === modal) {
    modal.classList.remove('show');
  }
});

// ============================================
// LANDING PAGE - KNOW MORE BUTTON (SMOOTH SCROLL)
// ============================================

document.getElementById('knowMoreBtn').addEventListener('click', () => {
  const infoSection = document.getElementById('infoSection');
  if (infoSection) {
    infoSection.scrollIntoView({ behavior: 'smooth' });
  }
});

// ============================================
// LANDING PAGE - START DEMO BUTTON
// ============================================

document.getElementById('startDemoBtn').addEventListener('click', () => {
  stopSlideshow();
  showPage('ivr');
  initializeIVRSession();
});

// ============================================
// IVR PAGE - BACK BUTTON
// ============================================

document.getElementById('backBtn').addEventListener('click', () => {
  showPage('landing');
  resetIVRSession();
  initializeSlideshow();
});

// ============================================
// IVR SESSION MANAGEMENT
// ============================================

function initializeIVRSession() {
  const chatMessages = document.getElementById('chatMessages');
  chatMessages.innerHTML = '';
  state.conversationStarted = true;
  state.userInputHistory = [];
  state.ivrStage = 'initial';

  // Display initial greeting
  addMessage('ai', initialGreeting);
  updatePhoneDisplay('Ready');

  // Speak the greeting
  speak(initialGreeting, 'en-IN');
}

function resetIVRSession() {
  state.conversationStarted = false;
  state.userInputHistory = [];
  state.ivrStage = 'initial';
  document.getElementById('chatMessages').innerHTML = '';
  updatePhoneDisplay('');
}

// ============================================
// CHAT INTERFACE
// ============================================

function addMessage(sender, text) {
  const chatMessages = document.getElementById('chatMessages');
  
  const messageDiv = document.createElement('div');
  messageDiv.className = `message ${sender}`;

  const bubble = document.createElement('div');
  bubble.className = 'message-bubble';
  bubble.innerText = text;

  const timeDiv = document.createElement('div');
  timeDiv.className = 'message-time';
  timeDiv.innerText = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  messageDiv.appendChild(bubble);
  messageDiv.appendChild(timeDiv);
  chatMessages.appendChild(messageDiv);

  // Auto-scroll to bottom
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

// ============================================
// DIAL PAD INTERACTION
// ============================================

document.querySelectorAll('.dial-btn').forEach(btn => {
  btn.addEventListener('click', (event) => {
    handleDialPadInput(event.target.dataset.key);
  });
});

function handleDialPadInput(key) {
  if (!state.conversationStarted) return;

  // Update display
  state.currentInputValue = key;
  updatePhoneDisplay(key);

  // Add user message to chat
  addMessage('user', `Button Pressed: ${key}`);

  // Get AI response
  const response = aiResponses[key] || 'Invalid input. Please try again with a number from 1-9.';
  
  // Add AI response after a short delay
  setTimeout(() => {
    addMessage('ai', response);
    speak(response, 'en-IN');
  }, 500);

  // Track history
  state.userInputHistory.push(key);

  // Handle exit condition
  if (key === '#') {
    setTimeout(() => {
      state.conversationStarted = false;
      updatePhoneDisplay('Call Ended');
    }, 1000);
  }
}

function updatePhoneDisplay(value) {
  const display = document.getElementById('phoneDisplay');
  if (!value) {
    display.innerText = 'Ready';
  } else if (value === '#') {
    display.innerText = 'Call Ended';
  } else if (state.userInputHistory.includes('#')) {
    display.innerText = 'Call Ended';
  } else {
    display.innerText = `Input: ${value}`;
  }
}

// ============================================
// TEXT-TO-SPEECH FUNCTIONALITY
// ============================================

function speak(text, lang = 'en-IN') {
  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  const speech = new SpeechSynthesisUtterance(text);
  speech.lang = lang;
  speech.rate = 0.9;
  speech.pitch = 1;
  speech.volume = 1;

  window.speechSynthesis.speak(speech);
}

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  console.log('🌾 Krishi AI - IVR System Initialized');
  console.log('Ready for interaction...');
  
  // Ensure landing page is visible on load
  showPage('landing');
  
  // Initialize slideshow
  initializeSlideshow();
});