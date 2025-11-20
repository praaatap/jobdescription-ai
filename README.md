# 📄 Resume Analyzer Pro — AI Browser Extension  

<img width="892" height="1027" alt="image" src="https://github.com/user-attachments/assets/04764ead-933b-49dc-9191-49b8b49e27de" />
<img width="880" height="1044" alt="image" src="https://github.com/user-attachments/assets/3b0a3c4f-4d21-4ba6-9105-76f861490f29" />
<img width="882" height="1039" alt="image" src="https://github.com/user-attachments/assets/5ad4eda5-906a-45a8-96b9-73a6a8d6d491" />
<img width="892" height="1027" alt="image" src="https://github.com/user-attachments/assets/67f6df65-65f0-46d6-9d64-2e18c40285b4" />

---

## ✨ Table of Contents
- [Project Introduction](#project-introduction)
- [Features](#features)
- [Getting Started](#getting-started)
  - [Quick User Installation](#quick-user-installation)
  - [Setup Guide](#setup-guide)
  - [Usage Instructions](#usage-instructions)
- [Developer Setup](#developer-setup)
  - [Project Structure](#project-structure)
  - [Local Build Instructions](#local-build-instructions)
- [How It Works](#how-it-works)
- [Security & Privacy](#security--privacy)
- [FAQ / Troubleshooting](#faq--troubleshooting)
- [Roadmap](#roadmap)
- [Credits](#credits)
- [Contributing](#contributing)
- [License](#license)

---

## 🏁 Project Introduction
**Resume Analyzer Pro** is a modern AI-powered job–resume matching extension.  
Upload your resume once → extract job data automatically → get a full ATS-style analysis instantly.

Perfect for:
- Job seekers  
- Students applying for internships  
- Professionals optimizing resumes  
- Recruiters and hiring teams  

**Stop guessing. Start applying smarter.**

---

## 🚀 Features

### 🧠 AI Job Match (Gemini-Powered)
- Full AI analysis using **Google Gemini**
- Produces:  
  ✔ Match Score (0–100)  
  ✔ Strongly Apply / Apply / Consider / Not Recommended  
  ✔ Resume Strengths  
  ✔ Improvements  
  ✔ ATS Keyword Gaps  
  ✔ Warnings & Quantification Tips  

---

### 📝 Resume Strengths & Weaknesses
- Extracted insights tailored to each job
- Keyword gap analysis for ATS optimization
- Actionable performance-oriented suggestions

---

### 💼 One-Click Job Extraction
- Extracts job data from:
  - LinkedIn  
  - Indeed  
  - Naukri  
  - Any generic job page  
- Context menu: **"🎯 Analyze This Job"**  
- Auto-fills job title, company, and description

---

### 📊 Smart Job History
- Tracks all your past analyses
- Manage status pipeline:
  - Pending → Applied → Interview → Rejected  
- Works like a built-in job tracker

---

### ✨ Elegant UI
- Glassmorphism-inspired modern UI
- 3-tab layout: Your Job • History • Settings  
- Auto + Manual Dark/Light mode  

---

## 🚚 Getting Started

## 📦 Quick User Installation
1. Download latest build from Releases  
2. Extract the ZIP  
3. Go to chrome://extensions  
4. Enable Developer mode  
5. Load unpacked → select extracted folder  

---

## ⚡ Setup Guide

### 1. Upload Your Resume
- Click extension → Your Job  
- Upload PDF resume  

### 2. Add Gemini API Key
- Get key from Google AI Studio  
- Paste inside Settings → Save  

---

## 🙋 Usage Instructions

### Analyze Any Job
1. Open job post  
2. Click extension  
3. Extract from Current Page  
4. Analyze Job Match  
5. Review match % and suggestions  

### Track Applications
- View history  
- Update status  

---

## 🧑‍💻 Developer Setup

### Project Structure
resume-analyzer-pro/
└── public/  
└── src/  
└── dist/  
└── screenshots/  
└── package.json  

---

## Local Build
npm install  
npm run build  

Load dist/ folder in Chrome as unpacked extension.

---

## ⚙️ How It Works
- PDF.js for resume parsing  
- Chrome Scripting API for job extraction  
- Gemini for AI scoring  
- Local storage for resume + history  

---

## 🔐 Security & Privacy
- All data stays local  
- API key stored in chrome sync  
- No external servers or trackers  

---

## 🛠️ FAQ
- Invalid API key → regenerate  
- Job extraction fails → paste manually  
- PDF unreadable → use text-based PDF  

---

## 🗺️ Roadmap
- DOCX support  
- Export as PDF  
- Multi-language  
- AI Cover Letter  

---

## 🙏 Credits
- Google Gemini  
- React + Vite  
- PDF.js  
- Chrome Extensions API  

---

## 🤝 Contributing
PRs welcome!
