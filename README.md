# Google Drive Transcript Extractor 🚀

A powerful automation tool to extract text transcripts from Google Drive video and audio files. This project features both a professional command-line interface and a premium web-based dashboard with glassmorphism design.

## ✨ Features

- **Automated Extraction**: Uses Playwright to navigate Google Drive and simulate user interactions to reveal transcript segments.
- **Transcript Merging**: Automatically aggregates all transcript time-segments into a single, cohesive text block.
- **Dynamic Naming**: Extracts the document title from the page and uses it to name the output `.txt` file automatically.
- **Premium Web UI**: A sleek, modern web interface with real-time status updates and direct file downloads.
- **Sanitization**: Automatically handles illegal filename characters and removes Google Drive suffixes.

## 🛠️ Technology Stack

- **Backend**: Node.js, Express
- **Automation**: Playwright (Chromium)
- **Frontend**: Vanilla HTML5, CSS3 (Modern Glassmorphism), JavaScript
- **Typography**: Inter (Google Fonts)

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v16 or higher recommended)
- [npm](https://www.npmjs.com/)

### Installation

1. Clone or download the project to your local machine.
2. Open your terminal in the project directory.
3. Install the required dependencies:
   ```bash
   npm install
   npx playwright install chromium
   ```

## 📖 Usage

### Option 1: Web Interface (Recommended)

Start the local server:
```bash
node server.js
```
Then open your browser and navigate to `http://localhost:3000`. Simply paste your Google Drive link and click **Extract & Download**.

### Option 2: Command Line

To run a single extraction directly from the terminal, you can modify the URL in `extract_transcript.js` and run:
```bash
node extract_transcript.js
```

## 📁 Project Structure

```text
├── public/                 # Web interface assets
│   ├── index.html          # Main dashboard
│   └── style.css           # Premium styling
├── extractor.js            # Reusable core extraction logic
├── server.js               # Express backend server
├── extract_transcript.js    # CLI entry point
└── .gitignore              # Dependency management
```

## ⚖️ License

This project is for educational and personal use in the context of Cultural Studies research.
