# MoodQuotes - AI-Powered Personalized Quote Generator

> **"Your mood, your words."**  
> Tell us how you're feeling. We'll find the words for it.

MoodQuotes is a responsive web application that generates meaningful, personalized quotes based on your current emotional state. Rather than serving static quotes or generic motivational clichés, MoodQuotes uses Gemma 4 through the Google AI API to craft emotionally resonant, original reflections tailored to how you are feeling right now.

---

## Features

- **12 Curated Emotional States**: Happy 😊, Sad 😔, Motivated 🔥, Anxious 😟, Confused 🤔, Lonely 🥺, Grateful 🙏, Overwhelmed 😮‍💨, Hopeful 🌱, Unmotivated 😴, Confident 😎, Heartbroken 💔.
- **Deep Emotional Resonance**: Employs Gemma 4 AI to generate an original quote, a thoughtful explanation of what it means, and an empathetic personal message.
- **"Give me another"**: Generates fresh perspectives for the same mood while avoiding duplicates.
- **Copy & Share**: Quick one-click copy to clipboard with toast confirmation and native Web Share API support with fallback.
- **Favorites & Persistence**: Save quotes you cherish locally in your browser (`localStorage`) with a dedicated Favorites view and duplicate prevention.
- **Calm, Mindful Aesthetics**: Soft warm color palette, gentle typography, peaceful animations, and distraction-free layout.
- **Secure Server-Side Architecture**: Proxies all AI calls through a secure Node.js/Express backend so API keys are never exposed in the browser.

---

## Tech Stack

- **Frontend**: React, Vite, Tailwind CSS, Lucide Icons
- **Backend / Proxy**: Express, Node.js (`server.ts`)
- **AI Model**: Gemma 4 (`gemma-4-31b-it`, `gemma-4-26b-a4b-it`) via `@google/genai` with fallback support to `gemini-3.5-flash-lite`

---

## Getting Started

### 1. Prerequisites

- [Node.js](https://nodejs.org/) (version 18 or newer)
- A Google AI Studio API Key

### 2. Obtaining a Google AI API Key

1. Visit [Google AI Studio](https://aistudio.google.com/).
2. Sign in with your Google account.
3. Click on **"Get API key"** in the navigation.
4. Click **"Create API key in new project"** (or select an existing Google Cloud project).
5. Copy your generated API key.

### 3. Installation & Setup

1. Clone or download the repository:
   ```bash
   git clone https://github.com/your-username/moodquotes.git
   cd moodquotes
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
   Add your Google AI API key:
   ```env
   GEMINI_API_KEY="your-actual-api-key-here"
   PORT=3000
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```
   Open your browser and navigate to `http://localhost:3000`.

### 4. Production Build

To build the project for production:

```bash
npm run build
npm start
```

---

## Project Structure

```
├── .env.example
├── .gitignore
├── README.md
├── index.html
├── metadata.json
├── package.json
├── server.ts                 # Secure Express backend proxying Google AI API
├── src/
│   ├── App.tsx               # Main container & state management
│   ├── index.css             # Tailwind CSS & custom animations
│   ├── main.tsx              # Application mount
│   ├── components/
│   │   ├── Header.jsx        # Navigation & branding header
│   │   ├── MoodCard.jsx      # Interactive mood button card
│   │   ├── MoodSelector.jsx  # 12-mood grid & generation trigger
│   │   ├── QuoteCard.jsx     # Generated quote presentation card
│   │   ├── Favorites.jsx     # Saved favorites view & management
│   │   └── LoadingState.jsx  # Calming loading animation
│   └── services/
│       └── geminiService.js  # Client API interface
├── tsconfig.json
└── vite.config.ts
```

---

## License

Apache-2.0
