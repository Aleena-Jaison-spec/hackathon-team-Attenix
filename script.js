let currentLanguage = null;

const screen = document.getElementById("screen");
const buttons = document.getElementById("buttons");

function speak(text) {
  const speech = new SpeechSynthesisUtterance(text);
  speech.lang = currentLanguage === "hindi" ? "hi-IN" :
                currentLanguage === "malayalam" ? "ml-IN" :
                "en-IN";
  window.speechSynthesis.speak(speech);
}

function renderMenu(menu) {
  screen.innerHTML = `<p>${menu.message}</p>`;
  buttons.innerHTML = "";

  menu.options.forEach(option => {
    const btn = document.createElement("button");
    btn.innerText = option.key;
    btn.onclick = () => handleInput(option);
    buttons.appendChild(btn);
  });

  speak(menu.message);
}

function handleInput(option) {

  if (option.lang) {
    currentLanguage = option.lang;
    renderMenu(ivrData[currentLanguage].main);
  } else {
    screen.innerHTML = `<p>AI is analysing your request...</p>`;
    buttons.innerHTML = "";
    speak("AI is analysing your request");
  }
}

renderMenu(ivrData.welcome);