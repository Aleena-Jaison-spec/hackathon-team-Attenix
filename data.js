const ivrData = {

  welcome: {
    message: "Welcome to Krishi AI",
    options: [
      { key: "1", text: "Press 1 for English", lang: "english" },
      { key: "2", text: "हिंदी के लिए 2 दबाएँ", lang: "hindi" },
      { key: "3", text: "മലയാളത്തിനായി 3 അമർത്തുക", lang: "malayalam" }
    ]
  },

  english: {
    main: {
      message: "Please choose what you need today:",
      options: [
        { key: "1", text: "Crop Advice" },
        { key: "2", text: "Weather Alerts" },
        { key: "3", text: "Market Prices" }
      ]
    },
    flows: {
      crop: {
        name: "Crop Advice",
        questions: [
          { key: "district", type: "text", prompt: "Enter your district name" },
          { key: "landSize", type: "text", prompt: "Enter your land size (in acres)" },
          { key: "irrigation", type: "choice", prompt: "Do you have irrigation?", options: [
              { key: "1", text: "Yes" },
              { key: "2", text: "No" }
            ]
          },
          { key: "cropType", type: "text", prompt: "Which crop are you planning to grow?" },
          { key: "startTime", type: "choice", prompt: "When will you start farming?", options: [
              { key: "1", text: "This month" },
              { key: "2", text: "Next month" },
              { key: "3", text: "After 3 months" }
            ]
          }
        ],
        final: "Thank you. AI is analysing demand, weather and price trends."
      },
      weather: {
        name: "Weather Alerts",
        questions: [
          { key: "district", type: "text", prompt: "Enter your district name" },
          { key: "currentCrop", type: "text", prompt: "Which crop are you currently growing?" },
          { key: "plantedDate", type: "text", prompt: "When was the crop planted?" },
          { key: "alertMethod", type: "choice", prompt: "How would you like to receive alerts?", options: [
              { key: "1", text: "Phone call" },
              { key: "2", text: "SMS" },
              { key: "3", text: "WhatsApp" }
            ]
          }
        ],
        final: "Thank you. Weather monitoring activated."
      },
      market: {
        name: "Market Prices",
        questions: [
          { key: "district", type: "text", prompt: "Enter your district name" },
          { key: "crop", type: "text", prompt: "Which crop price do you want to check?" },
          { key: "harvestTiming", type: "choice", prompt: "When will you harvest?", options: [
              { key: "1", text: "Within 1 week" },
              { key: "2", text: "Within 1 month" },
              { key: "3", text: "After 2–3 months" }
            ]
          }
        ],
        final: "Thank you. Fetching latest market prices."
      }
    }
  },

  hindi: {
    main: {
      message: "आज आपको क्या चाहिए?",
      options: [
        { key: "1", text: "फसल सलाह" },
        { key: "2", text: "मौसम अलर्ट" },
        { key: "3", text: "मंडी कीमत" }
      ]
    },
    flows: {
      crop: {
        name: "Crop Advice",
        questions: [
          { key: "district", type: "text", prompt: "आपका खेत किस जिले में है?" },
          { key: "landSize", type: "text", prompt: "आपके पास कितनी जमीन है (एकड़ में)?" },
          { key: "irrigation", type: "choice", prompt: "क्या आपके पास सिंचाई है?", options: [
              { key: "1", text: "हाँ" },
              { key: "2", text: "नहीं" }
            ]
          },
          { key: "cropType", type: "text", prompt: "आप कौन सी फसल उगाना चाहते हैं?" },
          { key: "startTime", type: "choice", prompt: "आप खेती कब शुरू करेंगे?", options: [
              { key: "1", text: "इस महीने" },
              { key: "2", text: "अगले महीने" },
              { key: "3", text: "तीन महीने बाद" }
            ]
          }
        ],
        final: "Voice: AI विश्लेषण कर रहा है।"
      },
      weather: {
        name: "Weather Alerts",
        questions: [
          { key: "district", type: "text", prompt: "आपका खेत किस जिले में है?" },
          { key: "currentCrop", type: "text", prompt: "आप अभी कौन सी फसल उगा रहे हैं?" },
          { key: "plantedDate", type: "text", prompt: "फसल कब बोई गई थी?" },
          { key: "alertMethod", type: "choice", prompt: "अलर्ट कैसे प्राप्त करना चाहते हैं?", options: [
              { key: "1", text: "फोन कॉल" },
              { key: "2", text: "SMS" },
              { key: "3", text: "WhatsApp" }
            ]
          }
        ],
        final: "Voice: Weather monitoring activated."
      },
      market: {
        name: "Market Price",
        questions: [
          { key: "district", type: "text", prompt: "आपका खेत किस जिले में है?" },
          { key: "crop", type: "text", prompt: "आप किस फसल की कीमत जानना चाहते हैं?" },
          { key: "harvestTiming", type: "choice", prompt: "आप फसल कब काटेंगे?", options: [
              { key: "1", text: "1 सप्ताह में" },
              { key: "2", text: "1 महीने में" },
              { key: "3", text: "2–3 महीने बाद" }
            ]
          }
        ],
        final: "Voice: Fetching latest market prices."
      }
    }
  },

  malayalam: {
    main: {
      message: "ഇന്ന് നിങ്ങൾക്ക് എന്ത് സഹായം വേണം?",
      options: [
        { key: "1", text: "വിള നിർദ്ദേശം" },
        { key: "2", text: "കാലാവസ്ഥ മുന്നറിയിപ്പ്" },
        { key: "3", text: "മാർക്കേറ്റ് വില" }
      ]
    },
    flows: {
      crop: {
        name: "Crop Advice",
        questions: [
          { key: "district", type: "text", prompt: "Your farm is located in which district?" },
          { key: "landSize", type: "text", prompt: "How much land do you have (in acres)?" },
          { key: "irrigation", type: "choice", prompt: "Do you have irrigation?", options: [
              { key: "1", text: "ഉണ്ട്" },
              { key: "2", text: "ഇല്ല" }
            ]
          },
          { key: "cropType", type: "text", prompt: "Which crop do you intend to cultivate?" },
          { key: "startTime", type: "choice", prompt: "When will you start farming?", options: [
              { key: "1", text: "ഈ മാസം" },
              { key: "2", text: "അടുത്ത മാസം" },
              { key: "3", text: "3 മാസത്തിന് ശേഷം" }
            ]
          }
        ],
        final: "Voice: AI വിശകലനം നടത്തുന്നു."
      },
      weather: {
        name: "Weather Alerts",
        questions: [
          { key: "district", type: "text", prompt: "Your farm is located in which district?" },
          { key: "currentCrop", type: "text", prompt: "Which crop are you currently growing?" },
          { key: "plantedDate", type: "text", prompt: "When was the crop planted?" },
          { key: "alertMethod", type: "choice", prompt: "How would you like to receive alerts?", options: [
              { key: "1", text: "ഫോൺ കോൾ" },
              { key: "2", text: "SMS" },
              { key: "3", text: "WhatsApp" }
            ]
          }
        ],
        final: "Voice: Weather monitoring activated."
      },
      market: {
        name: "Market Price",
        questions: [
          { key: "district", type: "text", prompt: "Your farm is located in which district?" },
          { key: "crop", type: "text", prompt: "Which crop price do you want to know?" },
          { key: "harvestTiming", type: "choice", prompt: "When will you harvest?", options: [
              { key: "1", text: "1 ആഴ്‌ചയ്ക്കുള്ളിൽ" },
              { key: "2", text: "1 മാസംക്കുള്ളിൽ" },
              { key: "3", text: "2–3 മാസങ്ങൾക്ക് ശേഷം" }
            ]
          }
        ],
        final: "Voice: Fetching latest market prices."
      }
    }
  }

};