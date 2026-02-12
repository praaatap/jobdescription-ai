# JobFit AI - Resume Analyzer Chrome Extension

AI-powered Chrome extension that analyzes your resume against job descriptions using Google Gemini AI.

## Features

- 📄 **Resume Upload** - Upload your PDF resume once, it's saved for all analyses
- 🔍 **Job Extraction** - Extract job descriptions from any job posting page with one click
- 🎯 **Match Analysis** - Get a detailed match score and recommendations
- 💪 **Strengths & Improvements** - See what makes you a great fit and what to work on
- 🔑 **Missing Keywords** - Find keywords to add to your resume for ATS optimization
- 💼 **Interview Tips** - Get personalized interview preparation tips
- ✉️ **Cover Letter Generator** - Generate tailored cover letters for each application
- 📊 **Job History** - Track all your analyzed jobs and their statuses

## Images
<img width="727" height="962" alt="Screenshot 2025-12-27 221603" src="https://github.com/user-attachments/assets/ece195ce-3d00-49b2-86b1-6a15eac27131" />
<img width="729" height="964" alt="Screenshot 2025-12-27 221653" src="https://github.com/user-attachments/assets/766c3c36-5b0a-43b0-afe0-c3943bbd4aec" />
<img width="729" height="964" alt="Screenshot 2025-12-27 221639" src="https://github.com/user-attachments/assets/a0b9ed20-78c5-4401-9c4e-701633865775" />
<img width="732" height="862" alt="image" src="https://github.com/user-attachments/assets/307dba3c-930f-4cb6-be54-57dcf958547e" />
<img width="725" height="970" alt="image" src="https://github.com/user-attachments/assets/12734ca0-eebb-4b5c-9b0a-90afa2260012" />

## Installation

### From Chrome Web Store
1. Visit the [Chrome Web Store listing](#) (coming soon)
2. Click "Add to Chrome"
3. Follow the prompts to install

### Manual Installation (Developer Mode)
1. Download or clone this repository
2. Run `npm install` and `npm run build`
3. Open Chrome and go to `chrome://extensions/`
4. Enable "Developer mode" (toggle in top right)
5. Click "Load unpacked"
6. Select the `dist` folder from this project

## Setup

1. Get a free Gemini API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Click the JobFit AI extension icon
3. Go to Settings tab
4. Paste your API key and click Save

## How to Use

1. **Upload Resume**: Click the extension icon → Upload your resume PDF
2. **Visit a Job Posting**: Navigate to any job page (LinkedIn, Indeed, etc.)
3. **Extract & Analyze**: Click "Extract from Current Page" or paste job description manually
4. **Review Results**: See your match score, strengths, improvements, and tips
5. **Generate Cover Letter**: Go to Cover Letter tab for a tailored letter

## Tech Stack

- **Frontend**: React 19, TypeScript, CSS Modules
- **PDF Processing**: PDF.js
- **AI**: Google Gemini 1.5 Flash
- **Build**: Vite
- **Extension**: Chrome Manifest V3

## Publishing to Chrome Web Store

1. Create a [Chrome Web Store Developer account](https://chrome.google.com/webstore/devconsole/) ($5 one-time fee)
2. Go to the Developer Dashboard
3. Click "New Item"
4. Upload `jobfit-ai-extension.zip`
5. Fill in the store listing:
   - **Name**: JobFit AI - Resume Analyzer
   - **Description**: See below
   - **Category**: Productivity
   - **Screenshots**: Take screenshots of the extension in action
   - **Icon**: Use the icon from `/public/icon128.png`
6. Submit for review

### Store Description

```
JobFit AI analyzes your resume against job descriptions using AI to help you land your dream job.

🎯 FEATURES:
• Match Score - See how well your resume matches the job
• Strengths Analysis - Know what makes you stand out
• Improvement Tips - Get actionable suggestions
• Missing Keywords - Optimize for ATS systems
• Interview Prep - Get personalized interview tips
• Cover Letter - Generate tailored cover letters

📋 HOW IT WORKS:
1. Upload your resume (PDF)
2. Visit any job posting
3. Click "Extract" to analyze
4. Get instant AI-powered insights

🔒 PRIVACY:
• Your resume is stored locally in your browser
• Resume and job data sent only to Google Gemini for analysis
• No third-party data sharing

💡 REQUIRES:
• Free Google Gemini API key (get it at aistudio.google.com)

Perfect for job seekers who want to:
✓ Tailor their resume to each job
✓ Identify skill gaps
✓ Prepare for interviews
✓ Write compelling cover letters
```

## Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Type check
npm run type-check
```

## License

MIT License

---

Made with ❤️ for job seekers everywhere
