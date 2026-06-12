# Gemini Clone

A Gemini-style AI chat interface built with React and Vite, powered by the Google Gemini API. Ask questions, generate code, and get nicely formatted markdown responses — all with structured AI output for accurate rendering.

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-7-646CFF?logo=vite&logoColor=white)
![Gemini](https://img.shields.io/badge/Gemini-2.5%20Flash-4285F4?logo=googlegemini&logoColor=white)

## Overview

Gemini Clone is a single-page React application that replicates the core chat experience of Google Gemini. It sends prompts to the **Gemini 2.5 Flash** model using the `@google/genai` SDK and renders the response with proper markdown formatting — headings, bold/italic text, lists, inline code, and syntax-highlighted code blocks.

The app uses Gemini's **structured output** feature (`responseSchema`) so the model itself classifies its answer as plain text, markdown, or code, allowing the UI to render each type correctly without fragile string parsing.

## Features

- **Conversational chat UI** — Gemini-style layout with greeting screen, prompt cards, and chat results
- **Send on Enter** — type your prompt and press Enter to send, no need to click the send button
- **Structured AI responses** — Gemini returns `{ type, content, language, explanation }`, so text, markdown, and code answers are rendered appropriately
- **Markdown rendering** — headings, bold, italic, bullet/numbered lists, and inline code render as proper HTML
- **Code block rendering** — code answers are shown in a formatted `<pre><code>` block with language tagging
- **Sidebar navigation** — new chat, recent prompts, and quick links (placeholder UI)
- **Responsive design** — works on desktop and mobile

## Tech Stack

| Technology | Purpose |
|---|---|
| React 19 | Core UI library for building components |
| Vite | Build tool & dev server |
| CSS | Styling & responsive layout |
| Google Gemini API (`@google/genai`) | AI response generation with structured output |

## Project Structure

```
geminiClone-main/
├── public/
│   └── vite.svg
├── src/
│   ├── assets/                  # Icons and images
│   ├── components/
│   │   ├── Main/                # Chat window, prompt input, results
│   │   │   ├── Main.jsx
│   │   │   └── Main.css
│   │   └── Sidebar/              # Sidebar navigation
│   │       ├── Sidebar.jsx
│   │       └── Sidebar.css
│   ├── Context/
│   │   └── Context.jsx          # Global state: prompts, results, loading
│   ├── config/
│   │   └── gemini.js             # Gemini API call + structured output schema
│   ├── utils/
│   │   └── formatResponse.js     # Converts structured AI response -> HTML
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── index.html
├── vite.config.js
└── package.json
```

## Prerequisites

Make sure the following are installed/available before running the project:

- Node.js v18 or higher
- npm v9+ or yarn
- A Google Gemini API key from [Google AI Studio](https://aistudio.google.com/app/apikey)

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/<your-username>/geminiClone.git
cd geminiClone-main
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the project root:

```bash
VITE_GEMINI_API_KEY=your-gemini-api-key-here
```

### 4. Run the Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

### 5. Build for Production

```bash
npm run build
```

## How It Works

1. The user types a prompt and presses **Enter** (or clicks the send icon).
2. `Context.jsx` calls `main(prompt)` from `src/config/gemini.js`.
3. `gemini.js` sends the prompt to **Gemini 2.5 Flash** with a `responseSchema` that asks the model to classify its own output as `text`, `markdown`, or `code`, returning structured JSON.
4. `formatResponse.js` converts the structured response into HTML:
   - `text` / `markdown` → headings, lists, bold/italic, inline code rendered via a lightweight markdown-to-HTML converter
   - `code` → a syntax-tagged `<pre><code>` block, with an optional markdown explanation
5. The formatted HTML is rendered in the chat result area.

## Environment Variables

| Variable | Description |
|---|---|
| `VITE_GEMINI_API_KEY` | Your Google Gemini API key (required) |

## License

This project is for educational purposes — feel free to fork and build on it.
