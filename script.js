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
  ivrStage: 'initial'
};

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
// LANDING PAGE - START DEMO BUTTON
// ============================================

document.getElementById('startDemoBtn').addEventListener('click', () => {
  showPage('ivr');
  initializeIVRSession();
});

// ============================================
// IVR PAGE - BACK BUTTON
// ============================================

document.getElementById('backBtn').addEventListener('click', () => {
  showPage('landing');
  resetIVRSession();
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
});