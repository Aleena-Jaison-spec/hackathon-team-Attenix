# 🌾 KRISHI AI – AI Powered IVR Agriculture Assistant

---

## 📌 Problem Statement

Agriculture is the backbone of India, yet millions of farmers still struggle to access timely and reliable farming guidance.

Most existing AgriTech solutions are delivered through mobile applications or websites, which assume that farmers:
- Are comfortable using smartphones and apps
- Can read and type in English or Hindi
- Have stable internet connectivity
- Understand how to navigate modern digital interfaces

In reality, a large portion of farmers:
- Prefer basic mobile phones
- Have limited digital literacy
- Face language barriers
- Rely on phone calls for help rather than apps

Government and private agricultural helplines exist, but they suffer from:
- Long waiting times
- Limited availability of human operators
- Lack of multilingual support
- Restricted working hours

As a result, farmers often receive late or no guidance during critical moments such as pest attacks, crop diseases, fertilizer decisions, or sudden weather changes. This delay can lead to crop loss, reduced yield, and financial stress.

---

## 💡 Solution Description

KRISHI AI is an AI-powered IVR (Interactive Voice Response) system that transforms agricultural assistance into a simple phone call experience.

Instead of requiring farmers to download and use apps, our system simulates a real agricultural helpline powered by Artificial Intelligence.

Farmers can:
- Select their preferred language
- Navigate through IVR menu options
- Ask farming questions naturally
- Receive instant AI-generated voice responses

The system combines:
- AI language models for intelligent responses
- Text-to-speech technology for natural voice output
- IVR call-flow design for accessibility

This approach removes the technology barrier and brings digital agriculture support to farmers in the most familiar format — a phone call.

---

## ⚙️ How It Works

1. The user opens the IVR simulator and initiates a call.
2. The system greets the user and asks them to choose a language.
3. The user navigates through agricultural categories such as crop advice, pest control, fertilizer guidance, and weather information.
4. The user submits a farming question.
5. The backend sends the query to an AI language model.
6. The AI generates a simple and farmer-friendly response.
7. The response is converted into natural speech.
8. The voice reply is played back to the user.

This creates a realistic helpline conversation experience powered entirely by AI.

---

## ⭐ Key Features

- Multilingual IVR interaction
- AI-generated agricultural guidance
- Natural voice responses using Text-to-Speech
- 24×7 availability with no waiting time
- Beginner-friendly guided menu + open AI chat
- Scalable architecture ready for telecom integration
- Designed for farmers with low digital literacy

---

## 🛠 Technology Stack

### Frontend
- HTML
- CSS
- JavaScript

### Backend
- Node.js
- Express.js

### AI & Cloud Services
- Groq API (Large Language Model)
- Amazon Polly (Text-to-Speech)

---

## 🚀 Setup Instructions

### 1. Clone the Repository
git clone https://github.com/Aleena-Jaison-spec/hackathon-team-Attenix.git  
cd hackathon-team-Attenix  

### 2. Backend Setup
cd backend  
npm install  

Create a `.env` file inside the backend folder and add:

AWS_ACCESS_KEY_ID=your_key  
AWS_SECRET_ACCESS_KEY=your_secret  
AWS_REGION=ap-south-1  
GROQ_API_KEY=your_key  
GROQ_MODEL=mixtral-8x7b-32768  

Start the backend server:
node server.js  

Backend runs on:
http://localhost:3000  

### 3. Run Frontend
From the root folder run:
npx http-server -p 8000  

Open in browser:
http://localhost:8000  

---

## 👥 Team Members

Aleena Jaison

Christeena Jiji

Arjun Narayan P

Mohammed Shamil

---

## 🎯 Project Vision

KRISHI AI aims to bridge the last-mile accessibility gap in agriculture by transforming advanced AI technology into a simple, familiar, and scalable phone-based support system for farmers.
