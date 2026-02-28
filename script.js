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
  ivrStage: 'language',
  selectedLanguage: null
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

const initialGreeting = ivrData.welcome.message;

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
  state.ivrStage = 'language';
  state.selectedLanguage = null ;

  // Display initial greeting
  addMessage('ai', ivrData.welcome.message);

  // Speak welcome options
  let welcomeText = ivrData.welcome.message;
  ivrData.welcome.options.forEach(opt => {
  welcomeText += ` ${opt.text}.`;
  });

  speak(welcomeText, 'en-IN');
  updatePhoneDisplay('Ready');

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

async function handleDialPadInput(key) {
  if (!state.conversationStarted) return;

  state.currentInputValue = key;
  updatePhoneDisplay(key);
  addMessage('user', `Button Pressed: ${key}`);

    // if we are in a subflow and waiting for a choice answer, handle it here
  if (state.currentFlow && state.questionIndex != null) {
    const flowData = ivrData[state.selectedLanguage].flows[state.currentFlow];
    const question = flowData.questions[state.questionIndex];
    if (question) {
      if (question.type === 'choice') {
        const selected = question.options.find(o => o.key === key);
        if (!selected) {
          const respText = question.prompt + ' Invalid selection.';
          addMessage('ai', respText);
          speak(respText, state.selectedLanguage === 'hindi' ? 'hi-IN' : 'en-IN');
          return;
        }
        // store answer text or raw key
        state.flowAnswers[question.key] = selected.text || key;
        state.questionIndex++;
        await askNextQuestion();
        return;
      } else if (question.type === 'text') {
        // ignore dial‑pad input; the browser prompt will collect the answer
        addMessage('ai', 'Please answer using the prompt that just appeared.');
        return;
      }
    }
  }

  let response = '';

  // ===== STAGE 1: LANGUAGE SELECTION =====
  if (state.ivrStage === 'language') {
    const selected = ivrData.welcome.options.find(opt => opt.key === key);

    if (!selected) {
      response = 'Invalid choice. Please select your language.';
    } else {
      state.selectedLanguage = selected.lang;
      state.ivrStage = 'mainMenu';

      response = ivrData[selected.lang].main.message;

      // Add menu options text
      ivrData[selected.lang].main.options.forEach(opt => {
        response += ` Press ${opt.key} for ${opt.text}.`;
      });
    }
  }

  // ===== STAGE 2: MAIN MENU =====
  else if (state.ivrStage === 'mainMenu') {
    const langMenu = ivrData[state.selectedLanguage].main.options;
    const choice = langMenu.find(opt => opt.key === key);

    if (!choice) {
      response = 'Invalid option. Please try again.';
    } else {
      // move into a subflow based on the menu choice
      let flowName;
      switch (choice.key) {
        case '1': flowName = 'crop'; break;
        case '2': flowName = 'weather'; break;
        case '3': flowName = 'market'; break;
      }
      state.currentFlow = flowName;
      state.flowAnswers = {};
      state.questionIndex = 0;
      // ask first question in flow
      await askNextQuestion();
    }
  }

  // Add AI response
  setTimeout(() => {
  addMessage('ai', response);

  // 🌍 choose language for Polly
  let langCode = "en-IN";
  if (state.selectedLanguage === "hindi") langCode = "hi-IN";
  if (state.selectedLanguage === "malayalam") langCode = "en-IN"; // fallback

  speak(response, langCode);

}, 500);

  state.userInputHistory.push(key);
  // if we triggered a prompt question, it will call askNextQuestion itself

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
// QUESTION NAVIGATION HELPERS

async function askNextQuestion() {
  const langCode = state.selectedLanguage === 'hindi' ? 'hi-IN' : 'en-IN';
  const flowData = ivrData[state.selectedLanguage].flows[state.currentFlow];
  const question = flowData.questions[state.questionIndex];
  if (!question) {
    // finished flow
    addMessage('ai', flowData.final || flowData.thanks || 'Thank you.');
    speak(flowData.final || flowData.thanks || 'Thank you.', langCode);
    // compile answers and call AI
    const summary = Object.entries(state.flowAnswers)
      .map(([k,v]) => `${k}: ${v}`)
      .join(', ');
    const aiRes = await fetch('http://localhost:3000/ai', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({message: `Flow ${state.currentFlow} answers: ${summary}`})
    });
    const reply = await aiRes.text();
    addMessage('ai', reply);
    speak(reply, langCode);
    state.currentFlow = null;
    state.questionIndex = null;
    return;
  }

  if (question.type === 'choice') {
    let text = question.prompt;
    question.options.forEach(opt => { text += ` Press ${opt.key} for ${opt.text}.`; });
    addMessage('ai', text);
    speak(text, langCode);
  } else if (question.type === 'text') {
    const ans = window.prompt(question.prompt);
    state.flowAnswers[question.key] = ans;
    state.questionIndex++;
    await askNextQuestion();
  }
}

// ============================================
// TEXT-TO-SPEECH FUNCTIONALITY
// ============================================

// ============================================
// TEXT-TO-SPEECH FUNCTION (Amazon Polly)
// ============================================

async function speak(text, lang = "en-IN") {
  try {
    const res = await fetch("http://localhost:3000/tts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ text, lang })
    });

    const audioBlob = await res.blob();
    const audioUrl = URL.createObjectURL(audioBlob);
    new Audio(audioUrl).play();

  } catch (err) {
    console.error("TTS error:", err);
  }
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