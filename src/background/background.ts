// Background Service Worker for JobFit AI Chrome Extension

interface JobHistoryItem {
    id: number;
    jobTitle: string;
    company: string;
    matchScore: number;
    analyzedAt: number;
    url: string;
    status: 'pending' | 'applied' | 'interview' | 'rejected' | 'offer';
    fullAnalysis: unknown;
}

chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.local.set({ jobHistory: [], cachedResume: null });
    chrome.contextMenus.create({
        id: "analyzeJobPage",
        title: "Analyze with JobFit AI",
        contexts: ["page"]
    });
});

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
    if (info.menuItemId === "analyzeJobPage" && tab?.id) {
        chrome.action.openPopup();
    }
});

function createAnalysisPrompt(resumeText: string, jobDescText: string): string {
    return `You are an expert ATS and career coach. Analyze this resume against the job description.

Return ONLY valid JSON:
{
  "matchScore": <0-100>,
  "recommendation": "<strongly_apply|apply|consider|not_recommended>",
  "recommendationReasons": ["reason1", "reason2", "reason3"],
  "summary": "<one sentence assessment>",
  "strengths": ["strength1", "strength2", "strength3"],
  "improvements": ["improvement1", "improvement2", "improvement3"],
  "missingKeywords": ["keyword1", "keyword2", "keyword3"],
  "atsWarnings": ["warning1", "warning2"],
  "interviewTips": ["tip1", "tip2", "tip3"]
}

Guidelines:
- strongly_apply (85-100%): Excellent match
- apply (70-84%): Good match
- consider (50-69%): Moderate match
- not_recommended (0-49%): Poor match

---RESUME---
${resumeText.slice(0, 8000)}

---JOB DESCRIPTION---
${jobDescText.slice(0, 8000)}`;
}

function createCoverLetterPrompt(resumeText: string, jobDesc: string, jobTitle: string, company: string, tone: string, length: string): string {
    const lengths = { short: '150-200', medium: '250-350', long: '400-500' };
    return `Write a ${tone} cover letter for ${jobTitle} at ${company}. Length: ${lengths[length as keyof typeof lengths] || '250-350'} words.

Resume: ${resumeText.slice(0, 4000)}
Job: ${jobDesc.slice(0, 4000)}

Write the letter directly, no placeholders.`;
}

chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
    if (msg.type === "analyze") {
        handleAnalysis(msg, sendResponse);
        return true;
    }
    if (msg.type === "generateCoverLetter") {
        handleCoverLetter(msg.request, sendResponse);
        return true;
    }
    if (msg.type === "updateJobStatus") {
        handleStatusUpdate(msg.jobId, msg.status, sendResponse);
        return true;
    }
    return false;
});

async function handleAnalysis(msg: { resumeText: string; websiteText: string; jobTitle: string; company: string; url: string }, sendResponse: (r: unknown) => void) {
    try {
        const { geminiKey } = await chrome.storage.sync.get(["geminiKey"]) as { geminiKey?: string };
        if (!geminiKey) { sendResponse({ success: false, error: "Add API key in Settings" }); return; }

        const prompt = createAnalysisPrompt(msg.resumeText, msg.websiteText);
        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: { response_mime_type: "application/json", temperature: 0.7 }
            })
        });

        if (!res.ok) throw new Error((await res.json()).error?.message || 'API Error');

        const data = await res.json();
        const reply = data.candidates[0].content.parts[0].text;
        const analysis = JSON.parse(reply);

        const { jobHistory = [] } = await chrome.storage.local.get(['jobHistory']) as { jobHistory: JobHistoryItem[] };
        jobHistory.unshift({
            id: Date.now(),
            jobTitle: msg.jobTitle || 'Unknown',
            company: msg.company || 'Unknown',
            matchScore: analysis.matchScore,
            analyzedAt: Date.now(),
            url: msg.url || '',
            status: 'pending',
            fullAnalysis: analysis
        });
        if (jobHistory.length > 30) jobHistory.length = 30;
        await chrome.storage.local.set({ jobHistory });

        sendResponse({ success: true, reply });
    } catch (e) {
        sendResponse({ success: false, error: e instanceof Error ? e.message : 'Error' });
    }
}

async function handleCoverLetter(req: { resumeText: string; jobDescription: string; jobTitle: string; company: string; tone?: string; length?: string }, sendResponse: (r: unknown) => void) {
    try {
        const { geminiKey } = await chrome.storage.sync.get(["geminiKey"]) as { geminiKey?: string };
        if (!geminiKey) { sendResponse({ success: false, error: "Add API key" }); return; }

        const prompt = createCoverLetterPrompt(req.resumeText, req.jobDescription, req.jobTitle, req.company, req.tone || 'professional', req.length || 'medium');
        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }], generationConfig: { temperature: 0.8 } })
        });

        if (!res.ok) throw new Error('API Error');

        const data = await res.json();
        const content = data.candidates[0].content.parts[0].text;
        sendResponse({ success: true, coverLetter: { content, wordCount: content.split(/\s+/).length, generatedAt: Date.now() } });
    } catch (e) {
        sendResponse({ success: false, error: e instanceof Error ? e.message : 'Error' });
    }
}

async function handleStatusUpdate(jobId: number, status: string, sendResponse: (r: unknown) => void) {
    const { jobHistory = [] } = await chrome.storage.local.get(['jobHistory']) as { jobHistory: JobHistoryItem[] };
    const job = jobHistory.find(j => j.id === jobId);
    if (job) {
        job.status = status as JobHistoryItem['status'];
        await chrome.storage.local.set({ jobHistory });
    }
    sendResponse({ success: !!job });
}
