// Initialize storage on install
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({ 
    jobHistory: [],
    cachedResume: null
  });

  // Create context menu
  chrome.contextMenus.create({
    id: "analyzeJobPage",
    title: "🎯 Analyze This Job",
    contexts: ["page", "selection"]
  });
});

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === "analyzeJobPage") {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: extractJobDescription
    }, (results) => {
      if (results && results[0]) {
        const jobData = results[0].result;
        chrome.storage.local.set({ 
          lastExtractedJob: {
            text: jobData.description,
            title: jobData.title,
            company: jobData.company,
            url: tab.url,
            extractedAt: Date.now()
          }
        });
        chrome.action.openPopup();
      }
    });
  }
});

// Function to extract job description (runs in page context)
function extractJobDescription() {
  const selectors = {
    linkedin: {
      title: '.top-card-layout__title, .job-details-jobs-unified-top-card__job-title',
      company: '.topcard__org-name-link, .job-details-jobs-unified-top-card__company-name',
      description: '.show-more-less-html__markup, .jobs-description__content'
    },
    indeed: {
      title: '.jobsearch-JobInfoHeader-title, h1.jobTitle',
      company: '[data-company-name="true"], .jobsearch-InlineCompanyRating-companyHeader',
      description: '#jobDescriptionText, .jobsearch-jobDescriptionText'
    },
    naukri: {
      title: '.jd-header-title, h1',
      company: '.jd-header-comp-name, .comp-name',
      description: '.dang-inner-html, .job-desc'
    },
    generic: {
      title: 'h1, .job-title, [class*="title"]',
      company: '.company, [class*="company"]',
      description: 'article, main, [class*="description"], [class*="job-desc"]'
    }
  };

  let result = { title: '', company: '', description: '' };
  const hostname = window.location.hostname;
  
  let siteSelectors = selectors.generic;
  if (hostname.includes('linkedin')) siteSelectors = selectors.linkedin;
  else if (hostname.includes('indeed')) siteSelectors = selectors.indeed;
  else if (hostname.includes('naukri')) siteSelectors = selectors.naukri;

  try {
    const titleEl = document.querySelector(siteSelectors.title);
    const companyEl = document.querySelector(siteSelectors.company);
    const descEl = document.querySelector(siteSelectors.description);

    result.title = titleEl?.innerText?.trim() || document.title;
    result.company = companyEl?.innerText?.trim() || 'Unknown Company';
    result.description = descEl?.innerText?.trim() || document.body.innerText.slice(0, 5000);
  } catch (e) {
    result.description = document.body.innerText.slice(0, 5000);
  }

  return result;
}

// Update the createStructuredPrompt function in background.js:

function createStructuredPrompt(resumeText, jobDescText) {
  return `You are an expert ATS and career coach. Analyze this resume against the job description and provide a recommendation on whether the candidate should apply.

Respond ONLY with valid JSON in this exact structure:
{
  "matchScore": <number 0-100>,
  "recommendation": "<one of: strongly_apply | apply | consider | not_recommended>",
  "recommendationReasons": ["<reason why you gave this recommendation>", "<another reason>", "<final reason>"],
  "summary": "<one sentence overall fit>",
  "strengths": ["<specific strength 1>", "<specific strength 2>", "<specific strength 3>"],
  "improvements": ["<actionable improvement 1>", "<actionable improvement 2>", "<actionable improvement 3>"],
  "missingKeywords": ["<keyword1>", "<keyword2>", "<keyword3>"],
  "atsWarnings": ["<warning1>", "<warning2>"],
  "quantificationSuggestions": ["<suggestion1>", "<suggestion2>"]
}

Recommendation Guidelines:
- "strongly_apply" (85-100%): Excellent match, high chance of success
- "apply" (70-84%): Good match, worth applying with minor improvements
- "consider" (50-69%): Moderate match, apply only if very interested
- "not_recommended" (0-49%): Poor match, focus on better-fit positions

---RESUME---
${resumeText}

---JOB DESCRIPTION---
${jobDescText}`;
}

// Handle messages from popup
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === "setKeys") {
    chrome.storage.sync.set({ geminiKey: msg.geminiKey });
    sendResponse({ success: true });
    return true;
  }

  if (msg.type === "analyze") {
    chrome.storage.sync.get(["geminiKey"], async (result) => {
      const apiKey = result.geminiKey;
      if (!apiKey) {
        sendResponse({ success: false, error: "Gemini API key not found." });
        return;
      }

      const { resumeText, websiteText, jobTitle, company, url } = msg;
      const prompt = createStructuredPrompt(resumeText, websiteText);
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`;

      try {
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              response_mime_type: "application/json",
              temperature: 0.7
            }
          })
        });

        if (!response.ok) {
          const errorBody = await response.json();
          throw new Error(`API Error: ${errorBody.error.message}`);
        }

        const data = await response.json();
        const llmResponseText = data.candidates[0].content.parts[0].text;
        
        const analysisResult = JSON.parse(llmResponseText);
        chrome.storage.local.get(['jobHistory'], (storage) => {
          const history = storage.jobHistory || [];
          history.unshift({
            id: Date.now(),
            jobTitle: jobTitle || 'Unknown Position',
            company: company || 'Unknown Company',
            matchScore: analysisResult.matchScore,
            analyzedAt: Date.now(),
            url: url || '',
            status: 'pending',
            fullAnalysis: analysisResult
          });
          if (history.length > 50) history.length = 50;
          chrome.storage.local.set({ jobHistory: history });
        });

        sendResponse({ success: true, reply: llmResponseText });
      } catch (error) {
        console.error("Gemini API Error:", error);
        sendResponse({ success: false, error: error.message });
      }
    });
    return true;
  }

  if (msg.type === "updateJobStatus") {
    chrome.storage.local.get(['jobHistory'], (storage) => {
      const history = storage.jobHistory || [];
      const job = history.find(j => j.id === msg.jobId);
      if (job) {
        job.status = msg.status;
        chrome.storage.local.set({ jobHistory: history });
        sendResponse({ success: true });
      }
    });
    return true;
  }
});
