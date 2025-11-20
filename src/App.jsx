import { useState, useEffect } from "react";
import { getDocument } from "pdfjs-dist/legacy/build/pdf";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf";
import pdfjsWorker from "pdfjs-dist/legacy/build/pdf.worker?url";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

function App() {
  const [theme, setTheme] = useState("dark");
  const [autoTheme, setAutoTheme] = useState(true);
  const [resumeText, setResumeText] = useState("");
  const [resumeFileName, setResumeFileName] = useState("");
  const [jobDescText, setJobDescText] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [company, setCompany] = useState("");
  const [currentUrl, setCurrentUrl] = useState("");
  const [apiKeyGemini, setApiKeyGemini] = useState("");
  const [analysisResult, setAnalysisResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [keysSaved, setKeysSaved] = useState(false);
  const [resumeUploaded, setResumeUploaded] = useState(false);
  const [activeTab, setActiveTab] = useState("job"); // Start with job tab
  const [jobHistory, setJobHistory] = useState([]);
  const [expandedSections, setExpandedSections] = useState({
    strengths: true,
    improvements: true,
    keywords: false,
    ats: false,
    recommendation: true
  });
  const [extracting, setExtracting] = useState(false);
  const [showResumeUpload, setShowResumeUpload] = useState(false);

  const isExtension = typeof chrome !== "undefined" && chrome.runtime && chrome.runtime.id;

  // Auto theme detection
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleThemeChange = (e) => {
      if (autoTheme) {
        setTheme(e.matches ? 'dark' : 'light');
      }
    };

    if (autoTheme) {
      setTheme(mediaQuery.matches ? 'dark' : 'light');
    }

    mediaQuery.addEventListener('change', handleThemeChange);
    return () => mediaQuery.removeEventListener('change', handleThemeChange);
  }, [autoTheme]);

  useEffect(() => {
    if (isExtension) {
      chrome.storage.sync.get(['geminiKey', 'theme', 'autoTheme'], (result) => {
        if (result.geminiKey) {
          setApiKeyGemini(result.geminiKey);
          setKeysSaved(true);
        }
        if (result.autoTheme !== undefined) {
          setAutoTheme(result.autoTheme);
        }
        if (result.theme && !result.autoTheme) {
          setTheme(result.theme);
        }
      });

      chrome.storage.local.get(['cachedResume', 'lastExtractedJob', 'jobHistory'], (result) => {
        if (result.cachedResume) {
          setResumeText(result.cachedResume.text);
          setResumeFileName(result.cachedResume.fileName || 'Resume uploaded');
          setResumeUploaded(true);
        }
        if (result.lastExtractedJob) {
          setJobDescText(result.lastExtractedJob.text);
          setJobTitle(result.lastExtractedJob.title || '');
          setCompany(result.lastExtractedJob.company || '');
          setCurrentUrl(result.lastExtractedJob.url || '');
        }
        if (result.jobHistory) {
          setJobHistory(result.jobHistory);
        }
      });
    }
  }, [isExtension]);

  const toggleTheme = () => {
    if (autoTheme) {
      setAutoTheme(false);
    }
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    if (isExtension) {
      chrome.storage.sync.set({ theme: newTheme, autoTheme: false });
    }
  };

  const toggleAutoTheme = () => {
    const newAutoTheme = !autoTheme;
    setAutoTheme(newAutoTheme);
    if (isExtension) {
      chrome.storage.sync.set({ autoTheme: newAutoTheme });
    }
    if (newAutoTheme) {
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setTheme(isDark ? 'dark' : 'light');
    }
  };

  const extractCurrentPage = async () => {
    if (!resumeUploaded) {
      alert("⚠️ Please upload your resume first!");
      setShowResumeUpload(true);
      return;
    }

    if (!isExtension) {
      alert("This feature only works in the extension");
      return;
    }

    setExtracting(true);
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      
      const results = await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: () => {
          return {
            text: document.body.innerText,
            title: document.title,
            url: window.location.href
          };
        }
      });

      if (results && results[0]) {
        const { text, title, url } = results[0].result;
        setJobDescText(text);
        setJobTitle(title);
        setCurrentUrl(url);
        
        const urlMatch = url.match(/(?:https?:\/\/)?(?:www\.)?([^\/]+)/);
        if (urlMatch) {
          setCompany(urlMatch[1].split('.')[0]);
        }
        
        chrome.storage.local.set({ 
          lastExtractedJob: { text, title, url, extractedAt: Date.now() }
        });
      }
    } catch (err) {
      setError("Failed to extract page content");
      console.error(err);
    } finally {
      setExtracting(false);
    }
  };

  const handlePDFUpload = async (event) => {
    const file = event.target.files[0];
    if (file && file.type === "application/pdf") {
      setLoading(true);
      setError("");
      try {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await getDocument(arrayBuffer).promise;
        let text = "";
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();
          text += content.items.map((item) => item.str).join(" ") + "\n";
        }
        setResumeText(text);
        setResumeFileName(file.name);
        setResumeUploaded(true);
        setShowResumeUpload(false);
        
        if (isExtension) {
          chrome.storage.local.set({ 
            cachedResume: { text, fileName: file.name, uploadedAt: Date.now() }
          });
        }
      } catch (err) {
        setError("Error processing PDF. Try another file.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
  };

  const saveKeys = () => {
    if (!apiKeyGemini) {
      alert("Please enter your Gemini API key");
      return;
    }
    if (isExtension) {
      chrome.storage.sync.set({ geminiKey: apiKeyGemini }, () => {
        setKeysSaved(true);
      });
    } else {
      setKeysSaved(true);
    }
  };

  const analyze = () => {
    if (!resumeUploaded) {
      alert("⚠️ Please upload your resume first!");
      setShowResumeUpload(true);
      return;
    }
    
    if (!keysSaved) {
      alert("⚠️ Please configure your API key in Settings!");
      setActiveTab('settings');
      return;
    }
    
    if (!jobDescText.trim()) {
      alert("⚠️ Please add job description or extract from page!");
      return;
    }
    
    setLoading(true);
    setError("");
    setAnalysisResult(null);

    if (!isExtension) {
      setError("Extension environment required");
      setLoading(false);
      return;
    }

    chrome.runtime.sendMessage(
      { 
        type: "analyze", 
        resumeText, 
        websiteText: jobDescText, 
        jobTitle, 
        company, 
        url: currentUrl,
        includeRecommendation: true
      },
      (res) => {
        if (chrome.runtime.lastError) {
          setError(`Error: ${chrome.runtime.lastError.message}`);
        } else if (res && res.success) {
          try {
            const parsed = JSON.parse(res.reply);
            setAnalysisResult(parsed);
            chrome.storage.local.get(['jobHistory'], (storage) => {
              setJobHistory(storage.jobHistory || []);
            });
          } catch (e) {
            setError("Failed to parse response");
            console.error(e);
          }
        } else {
          setError(res?.error || "Analysis failed");
        }
        setLoading(false);
      }
    );
  };

  const updateJobStatus = (jobId, status) => {
    if (!isExtension) return;
    chrome.runtime.sendMessage(
      { type: "updateJobStatus", jobId, status },
      () => {
        chrome.storage.local.get(['jobHistory'], (storage) => {
          setJobHistory(storage.jobHistory || []);
        });
      }
    );
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  const clearResume = () => {
    setResumeText("");
    setResumeFileName("");
    setResumeUploaded(false);
    if (isExtension) {
      chrome.storage.local.remove('cachedResume');
    }
  };

  const getRecommendationStyle = (recommendation) => {
    if (recommendation === 'strongly_apply') {
      return { bg: 'rgba(16, 185, 129, 0.15)', border: 'rgba(16, 185, 129, 0.3)', color: '#10b981', text: '✓ Strongly Recommend' };
    } else if (recommendation === 'apply') {
      return { bg: 'rgba(59, 130, 246, 0.15)', border: 'rgba(59, 130, 246, 0.3)', color: '#3b82f6', text: '→ Apply' };
    } else if (recommendation === 'consider') {
      return { bg: 'rgba(245, 158, 11, 0.15)', border: 'rgba(245, 158, 11, 0.3)', color: '#f59e0b', text: '⚠ Consider' };
    } else {
      return { bg: 'rgba(239, 68, 68, 0.15)', border: 'rgba(239, 68, 68, 0.3)', color: '#ef4444', text: '✗ Not Recommended' };
    }
  };

  const styles = `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
    
    * { 
      margin: 0; 
      padding: 0; 
      box-sizing: border-box; 
    }
    
    body { 
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; 
      background: ${theme === 'dark' ? '#0f0f0f' : '#fafafa'};
      color: ${theme === 'dark' ? '#e4e4e7' : '#18181b'};
      line-height: 1.5; 
      width: 520px; 
      margin: 0;
      -webkit-font-smoothing: antialiased;
    }
    
    .popup-container { 
      width: 100%; 
      background: ${theme === 'dark' ? '#1a1a1a' : '#ffffff'};
      display: flex; 
      flex-direction: column; 
      height: 600px;
      box-shadow: ${theme === 'dark' ? '0 0 0 1px rgba(255,255,255,0.05)' : '0 0 0 1px rgba(0,0,0,0.05)'};
    }
    
    .header { 
      background: ${theme === 'dark' 
        ? 'linear-gradient(135deg, #1e293b 0%, #0f172a 50%, #020617 100%)' 
        : 'linear-gradient(135deg, #ffffff 0%, #f8fafc 50%, #f1f5f9 100%)'};
      padding: 0;
      border-bottom: 1px solid ${theme === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'};
      position: relative;
      overflow: hidden;
    }
    
    .header::before {
      content: '';
      position: absolute;
      inset: 0;
      background: ${theme === 'dark'
        ? 'radial-gradient(circle at 20% 50%, rgba(59, 130, 246, 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 50%, rgba(139, 92, 246, 0.1) 0%, transparent 50%)'
        : 'radial-gradient(circle at 20% 50%, rgba(59, 130, 246, 0.08) 0%, transparent 50%), radial-gradient(circle at 80% 50%, rgba(139, 92, 246, 0.06) 0%, transparent 50%)'};
      pointer-events: none;
      animation: headerPulse 8s ease-in-out infinite;
    }
    
    @keyframes headerPulse {
      0%, 100% { opacity: 0.5; }
      50% { opacity: 1; }
    }
    
    .header-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px 24px;
      position: relative;
      z-index: 1;
    }
    
    .brand {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    
    .logo-icon {
      width: 48px;
      height: 48px;
      border-radius: 14px;
      background: ${theme === 'dark' 
        ? 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)' 
        : 'linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)'};
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: ${theme === 'dark'
        ? '0 8px 24px rgba(59, 130, 246, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.1)'
        : '0 8px 24px rgba(59, 130, 246, 0.25), 0 0 0 1px rgba(59, 130, 246, 0.1)'};
      color: white;
    }
    
    .brand-text h1 { 
      font-size: 1.25rem; 
      font-weight: 800; 
      margin-bottom: 2px;
      letter-spacing: -0.03em;
      background: ${theme === 'dark'
        ? 'linear-gradient(135deg, #f8fafc 0%, #cbd5e1 100%)'
        : 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)'};
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    
    .brand-text p { 
      font-size: 0.8125rem; 
      color: ${theme === 'dark' ? '#94a3b8' : '#64748b'};
      font-weight: 500;
    }
    
    .header-actions {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    
    .theme-toggle {
      width: 42px;
      height: 42px;
      border-radius: 12px;
      background: ${theme === 'dark' 
        ? 'rgba(255, 255, 255, 0.08)' 
        : 'rgba(0, 0, 0, 0.04)'};
      border: 1px solid ${theme === 'dark' 
        ? 'rgba(255, 255, 255, 0.12)' 
        : 'rgba(0, 0, 0, 0.08)'};
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      backdrop-filter: blur(10px);
    }
    
    .theme-toggle:hover {
      background: ${theme === 'dark' 
        ? 'rgba(255, 255, 255, 0.12)' 
        : 'rgba(0, 0, 0, 0.08)'};
      transform: translateY(-2px) scale(1.05);
    }
    
    .theme-toggle svg {
      width: 20px;
      height: 20px;
      fill: ${theme === 'dark' ? '#f8fafc' : '#1e293b'};
    }
    
    .header-decoration {
      height: 3px;
      background: ${theme === 'dark'
        ? 'linear-gradient(90deg, transparent 0%, #3b82f6 20%, #8b5cf6 50%, #ec4899 80%, transparent 100%)'
        : 'linear-gradient(90deg, transparent 0%, #3b82f6 20%, #6366f1 50%, #8b5cf6 80%, transparent 100%)'};
      position: relative;
      overflow: hidden;
    }
    
    .header-decoration::after {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.6), transparent);
      animation: shimmer 3s infinite;
    }
    
    @keyframes shimmer {
      0% { left: -100%; }
      100% { left: 100%; }
    }
    
    .resume-bar {
      background: ${theme === 'dark' ? '#27272a' : '#f4f4f5'};
      border-bottom: 1px solid ${theme === 'dark' ? '#3f3f46' : '#e4e4e7'};
      padding: 12px 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .resume-info {
      display: flex;
      align-items: center;
      gap: 10px;
      flex: 1;
    }
    
    .resume-icon {
      width: 36px;
      height: 36px;
      border-radius: 8px;
      background: ${theme === 'dark' 
        ? 'linear-gradient(135deg, #10b981, #059669)' 
        : 'linear-gradient(135deg, #10b981, #059669)'};
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 1rem;
    }
    
    .resume-details {
      flex: 1;
    }
    
    .resume-name {
      font-size: 0.8125rem;
      font-weight: 600;
      color: ${theme === 'dark' ? '#fafafa' : '#18181b'};
      margin-bottom: 2px;
    }
    
    .resume-label {
      font-size: 0.6875rem;
      color: ${theme === 'dark' ? '#71717a' : '#a1a1aa'};
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    
    .resume-actions {
      display: flex;
      gap: 8px;
    }
    
    .content { 
      padding: 24px; 
      overflow-y: auto; 
      flex: 1;
      background: ${theme === 'dark' ? '#1a1a1a' : '#ffffff'};
    }
    
    .content::-webkit-scrollbar { width: 6px; }
    .content::-webkit-scrollbar-track { background: transparent; }
    .content::-webkit-scrollbar-thumb { 
      background: ${theme === 'dark' ? '#3f3f46' : '#d4d4d8'}; 
      border-radius: 10px; 
    }
    
    .tabs { 
      display: flex;
      gap: 8px;
      margin-bottom: 24px; 
      background: ${theme === 'dark' ? '#27272a' : '#f4f4f5'};
      padding: 5px;
      border-radius: 14px;
    }
    
    .tab { 
      flex: 1;
      padding: 12px 16px; 
      cursor: pointer; 
      font-weight: 600; 
      transition: all 0.2s ease; 
      color: ${theme === 'dark' ? '#a1a1aa' : '#71717a'}; 
      font-size: 0.875rem;
      border-radius: 10px;
      text-align: center;
    }
    
    .tab:hover { 
      color: ${theme === 'dark' ? '#fafafa' : '#18181b'}; 
      background: ${theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'};
    }
    
    .tab.active { 
      color: white;
      background: ${theme === 'dark' 
        ? 'linear-gradient(135deg, #3b82f6, #2563eb)' 
        : 'linear-gradient(135deg, #3b82f6, #1d4ed8)'};
      box-shadow: ${theme === 'dark' ? '0 4px 12px rgba(59,130,246,0.3)' : '0 4px 12px rgba(59,130,246,0.25)'};
    }
    
    .tab-content { 
      display: none; 
    }
    
    .tab-content.active { 
      display: block; 
      animation: fadeIn 0.3s ease; 
    }
    
    @keyframes fadeIn { 
      from { opacity: 0; transform: translateY(5px); } 
      to { opacity: 1; transform: translateY(0); } 
    }
    
    .section-title {
      font-size: 0.8125rem;
      font-weight: 700;
      color: ${theme === 'dark' ? '#fafafa' : '#18181b'};
      margin-bottom: 16px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    
    .extract-btn {
      background: ${theme === 'dark' 
        ? 'linear-gradient(135deg, #3b82f6, #2563eb)' 
        : 'linear-gradient(135deg, #3b82f6, #1d4ed8)'};
      color: white;
      width: 100%;
      padding: 14px;
      border-radius: 12px;
      font-weight: 700;
      font-size: 0.9375rem;
      margin-bottom: 20px;
      border: none;
      cursor: pointer;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      box-shadow: ${theme === 'dark' ? '0 4px 16px rgba(59,130,246,0.3)' : '0 4px 16px rgba(59,130,246,0.25)'};
    }
    
    .extract-btn:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: ${theme === 'dark' ? '0 8px 24px rgba(59,130,246,0.4)' : '0 8px 24px rgba(59,130,246,0.35)'};
    }
    
    .extract-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
      transform: none;
    }
    
    input[type="text"], textarea { 
      width: 100%; 
      padding: 14px 16px; 
      border: 1.5px solid ${theme === 'dark' ? '#3f3f46' : '#e4e4e7'}; 
      border-radius: 12px; 
      font-family: inherit; 
      font-size: 0.875rem; 
      transition: all 0.2s ease; 
      background: ${theme === 'dark' ? '#27272a' : '#f9fafb'};
      color: ${theme === 'dark' ? '#fafafa' : '#09090b'}; 
      margin-bottom: 14px;
      font-weight: 500;
    }
    
    input[type="text"]:focus, textarea:focus { 
      outline: none; 
      border-color: #3b82f6;
      background: ${theme === 'dark' ? '#1a1a1a' : '#ffffff'};
      box-shadow: 0 0 0 4px ${theme === 'dark' ? 'rgba(59, 130, 246, 0.15)' : 'rgba(59, 130, 246, 0.1)'};
    }
    
    input[type="text"]::placeholder, textarea::placeholder {
      color: ${theme === 'dark' ? '#71717a' : '#a1a1aa'};
    }
    
    textarea { 
      min-height: 140px; 
      resize: vertical; 
      line-height: 1.6;
    }
    
    .analyze-btn { 
      background: ${theme === 'dark' ? 'linear-gradient(135deg, #fafafa, #e4e4e7)' : 'linear-gradient(135deg, #18181b, #09090b)'};
      color: ${theme === 'dark' ? '#09090b' : '#fafafa'}; 
      width: 100%; 
      padding: 16px; 
      font-weight: 800;
      font-size: 1rem;
      border-radius: 12px;
      border: none;
      cursor: pointer;
      transition: all 0.2s ease;
      box-shadow: ${theme === 'dark' ? '0 4px 16px rgba(250,250,250,0.15)' : '0 4px 16px rgba(0,0,0,0.15)'};
      letter-spacing: 0.02em;
    }
    
    .analyze-btn:hover:not(:disabled) { 
      transform: translateY(-2px);
      box-shadow: ${theme === 'dark' ? '0 8px 24px rgba(250,250,250,0.2)' : '0 8px 24px rgba(0,0,0,0.2)'};
    }
    
    .analyze-btn:disabled { 
      background: ${theme === 'dark' ? '#3f3f46' : '#e4e4e7'};
      cursor: not-allowed; 
      color: ${theme === 'dark' ? '#71717a' : '#a1a1aa'};
      box-shadow: none;
    }
    
    .btn-small { 
      padding: 8px 16px; 
      font-size: 0.75rem; 
      background: ${theme === 'dark' ? '#3f3f46' : '#e4e4e7'};
      color: ${theme === 'dark' ? '#fafafa' : '#18181b'};
      border-radius: 8px;
      border: none;
      cursor: pointer;
      font-weight: 600;
      transition: all 0.2s ease;
    }
    
    .btn-small:hover { 
      background: ${theme === 'dark' ? '#52525b' : '#d4d4d8'};
      transform: translateY(-1px);
    }
    
    .upload-modal {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.6);
      backdrop-filter: blur(8px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      animation: fadeIn 0.2s ease;
    }
    
    .upload-modal-content {
      background: ${theme === 'dark' ? '#27272a' : '#ffffff'};
      border: 1px solid ${theme === 'dark' ? '#3f3f46' : '#e4e4e7'};
      border-radius: 16px;
      padding: 28px;
      width: 90%;
      max-width: 400px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
    }
    
    .upload-modal h3 {
      font-size: 1.125rem;
      font-weight: 700;
      margin-bottom: 16px;
      color: ${theme === 'dark' ? '#fafafa' : '#18181b'};
    }
    
    input[type="file"] { 
      width: 100%;
      padding: 14px; 
      font-size: 0.875rem;
      cursor: pointer;
      border: 2px dashed ${theme === 'dark' ? '#52525b' : '#d4d4d8'};
      background: ${theme === 'dark' ? '#1a1a1a' : '#f9fafb'};
      border-radius: 12px;
      color: ${theme === 'dark' ? '#a1a1aa' : '#71717a'};
      transition: all 0.2s ease;
      margin-bottom: 16px;
    }
    
    input[type="file"]:hover {
      border-color: #3b82f6;
      background: ${theme === 'dark' ? '#27272a' : '#ffffff'};
    }
    
    .modal-actions {
      display: flex;
      gap: 10px;
    }
    
    .recommendation-badge {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      padding: 14px 20px;
      border-radius: 12px;
      font-size: 1rem;
      font-weight: 800;
      margin-bottom: 24px;
      letter-spacing: 0.02em;
    }
    
    .score-container { 
      display: flex; 
      align-items: center; 
      justify-content: center; 
      flex-direction: column; 
      margin-bottom: 28px;
      padding: 28px 0;
    }
    
    .score-circle { 
      width: 120px; 
      height: 120px; 
      border-radius: 50%; 
      display: grid; 
      place-items: center; 
      background: conic-gradient(
        #3b82f6 0deg,
        #3b82f6 calc(var(--score) * 3.6deg), 
        ${theme === 'dark' ? '#27272a' : '#e4e4e7'} calc(var(--score) * 3.6deg)
      );
      font-size: 2.5rem; 
      font-weight: 800;
      position: relative;
      box-shadow: 0 10px 30px rgba(59,130,246,0.25);
    }
    
    .score-circle::before {
      content: '';
      position: absolute;
      inset: 10px;
      background: ${theme === 'dark' ? '#1a1a1a' : '#ffffff'};
      border-radius: 50%;
      z-index: -1;
    }
    
    .score-label { 
      font-size: 0.875rem; 
      color: ${theme === 'dark' ? '#a1a1aa' : '#71717a'}; 
      margin-top: 14px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.1em;
    }
    
    .report-summary { 
      color: ${theme === 'dark' ? '#d4d4d8' : '#52525b'}; 
      text-align: center; 
      margin-bottom: 28px; 
      padding: 18px;
      border-bottom: 1px solid ${theme === 'dark' ? '#27272a' : '#e4e4e7'}; 
      font-size: 0.9375rem;
      line-height: 1.7;
      background: ${theme === 'dark' ? '#27272a' : '#f9fafb'};
      border-radius: 12px;
      font-weight: 500;
    }
    
    .report-section { 
      margin-bottom: 16px;
      border: 1.5px solid ${theme === 'dark' ? '#3f3f46' : '#e4e4e7'};
      border-radius: 12px;
      overflow: hidden;
      background: ${theme === 'dark' ? '#27272a' : '#f9fafb'};
    }
    
    .report-section-header { 
      display: flex; 
      justify-content: space-between; 
      align-items: center; 
      cursor: pointer; 
      padding: 16px 18px; 
      transition: all 0.2s ease;
    }
    
    .report-section-header:hover { 
      background: ${theme === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)'};
    }
    
    .report-section-header h3 { 
      font-size: 0.9375rem; 
      margin: 0;
      font-weight: 700;
      color: ${theme === 'dark' ? '#fafafa' : '#18181b'};
    }
    
    .report-section .chevron { 
      width: 14px;
      height: 14px;
      border-right: 2.5px solid ${theme === 'dark' ? '#a1a1aa' : '#71717a'};
      border-bottom: 2.5px solid ${theme === 'dark' ? '#a1a1aa' : '#71717a'};
      transform: rotate(45deg);
      transition: transform 0.2s ease;
      margin-top: -3px;
    }
    
    .report-section .chevron.rotated { 
      transform: rotate(-135deg);
      margin-top: 3px;
    }
    
    .report-section ul { 
      list-style: none; 
      padding: 14px;
      margin: 0;
    }
    
    .report-section li { 
      background: ${theme === 'dark' ? '#1a1a1a' : '#ffffff'};
      padding: 14px 16px; 
      border-radius: 10px; 
      margin-bottom: 10px; 
      border-left: 3px solid ${theme === 'dark' ? '#3f3f46' : '#e4e4e7'};
      font-size: 0.875rem;
      line-height: 1.7;
      color: ${theme === 'dark' ? '#e4e4e7' : '#3f3f46'};
      transition: all 0.2s ease;
      font-weight: 500;
    }
    
    .report-section li:hover {
      transform: translateX(6px);
      border-left-color: #3b82f6;
    }
    
    .report-section.strengths li { border-left-color: #10b981; }
    .report-section.improvements li { border-left-color: #f59e0b; }
    .report-section.keywords li { border-left-color: #ef4444; }
    .report-section.ats li { border-left-color: #8b5cf6; }
    .report-section.recommendation li { border-left-color: #3b82f6; }
    
    .error-message { 
      background: ${theme === 'dark' ? 'rgba(239, 68, 68, 0.1)' : '#fef2f2'};
      border: 1.5px solid ${theme === 'dark' ? 'rgba(239, 68, 68, 0.3)' : '#fecaca'};
      color: ${theme === 'dark' ? '#fca5a5' : '#dc2626'};
      padding: 14px 16px; 
      border-radius: 12px; 
      margin: 16px 0; 
      font-size: 0.875rem;
      line-height: 1.6;
      font-weight: 500;
    }
    
    .loading-spinner {
      display: inline-block;
      width: 18px;
      height: 18px;
      border: 2.5px solid ${theme === 'dark' ? '#3f3f46' : '#e4e4e7'};
      border-top-color: ${theme === 'dark' ? '#fafafa' : '#18181b'};
      border-radius: 50%;
      animation: spin 0.6s linear infinite;
    }
    
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
    
    .history-item { 
      background: ${theme === 'dark' ? '#27272a' : '#f9fafb'};
      padding: 18px; 
      border-radius: 12px; 
      margin-bottom: 14px; 
      border: 1.5px solid ${theme === 'dark' ? '#3f3f46' : '#e4e4e7'};
      transition: all 0.2s ease;
      cursor: pointer;
    }
    
    .history-item:hover {
      border-color: ${theme === 'dark' ? '#52525b' : '#d4d4d8'};
      box-shadow: ${theme === 'dark' ? '0 6px 20px rgba(0,0,0,0.3)' : '0 6px 20px rgba(0,0,0,0.08)'};
      transform: translateY(-2px);
    }
    
    .history-header { 
      display: flex; 
      justify-content: space-between; 
      align-items: start; 
      margin-bottom: 12px; 
    }
    
    .history-title { 
      font-weight: 700; 
      font-size: 0.9375rem; 
      color: ${theme === 'dark' ? '#fafafa' : '#09090b'};
      line-height: 1.4;
    }
    
    .history-company { 
      font-size: 0.8125rem; 
      color: ${theme === 'dark' ? '#a1a1aa' : '#71717a'};
      margin-top: 4px;
      font-weight: 500;
    }
    
    .history-score { 
      font-size: 1.75rem; 
      font-weight: 800; 
      color: #3b82f6;
    }
    
    .history-meta { 
      display: flex; 
      gap: 12px; 
      font-size: 0.75rem; 
      color: ${theme === 'dark' ? '#71717a' : '#a1a1aa'}; 
      margin-top: 10px;
      align-items: center;
      font-weight: 600;
    }
    
    .status-badge { 
      padding: 6px 14px; 
      border-radius: 8px; 
      font-size: 0.6875rem; 
      font-weight: 700; 
      cursor: pointer;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      transition: all 0.2s ease;
    }
    
    .status-badge:hover { transform: scale(1.08); }
    
    .status-pending { 
      background: rgba(161, 161, 170, 0.15);
      color: ${theme === 'dark' ? '#d4d4d8' : '#71717a'};
    }
    
    .status-applied { 
      background: rgba(16, 185, 129, 0.15);
      color: #10b981;
    }
    
    .status-interview { 
      background: rgba(59, 130, 246, 0.15);
      color: #3b82f6;
    }
    
    .status-rejected { 
      background: rgba(239, 68, 68, 0.15);
      color: #ef4444;
    }
    
    .empty-state {
      text-align: center;
      padding: 60px 20px;
      color: ${theme === 'dark' ? '#71717a' : '#a1a1aa'};
    }
    
    .empty-state-icon {
      font-size: 3.5rem;
      margin-bottom: 16px;
      opacity: 0.3;
    }
    
    input[type="password"] {
      width: 100%; 
      padding: 14px 16px; 
      border: 1.5px solid ${theme === 'dark' ? '#3f3f46' : '#e4e4e7'}; 
      border-radius: 12px; 
      font-family: inherit; 
      font-size: 0.875rem; 
      transition: all 0.2s ease; 
      background: ${theme === 'dark' ? '#27272a' : '#f9fafb'};
      color: ${theme === 'dark' ? '#fafafa' : '#09090b'}; 
      margin-bottom: 14px;
      font-weight: 500;
    }
    
    input[type="password"]:focus {
      outline: none; 
      border-color: #3b82f6;
      background: ${theme === 'dark' ? '#1a1a1a' : '#ffffff'};
      box-shadow: 0 0 0 4px ${theme === 'dark' ? 'rgba(59, 130, 246, 0.15)' : 'rgba(59, 130, 246, 0.1)'};
    }
    
    .info-box {
      background: ${theme === 'dark' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(59, 130, 246, 0.05)'};
      border: 1.5px solid ${theme === 'dark' ? 'rgba(59, 130, 246, 0.2)' : 'rgba(59, 130, 246, 0.15)'};
      border-radius: 12px;
      padding: 14px 16px;
      margin-top: 16px;
      font-size: 0.8125rem;
      color: ${theme === 'dark' ? '#93c5fd' : '#1d4ed8'};
      line-height: 1.6;
      font-weight: 500;
    }
    
    .info-box a {
      color: ${theme === 'dark' ? '#60a5fa' : '#2563eb'};
      text-decoration: none;
      font-weight: 700;
    }
    
    .success-box {
      background: rgba(16, 185, 129, 0.1);
      border: 1.5px solid rgba(16, 185, 129, 0.2);
      border-radius: 12px;
      padding: 14px 16px;
      margin-top: 14px;
      font-size: 0.875rem;
      color: #10b981;
      font-weight: 600;
    }
    
    .auto-theme-toggle {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 14px 16px;
      background: ${theme === 'dark' ? '#27272a' : '#f9fafb'};
      border: 1.5px solid ${theme === 'dark' ? '#3f3f46' : '#e4e4e7'};
      border-radius: 12px;
      margin-bottom: 14px;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    
    .auto-theme-toggle:hover {
      background: ${theme === 'dark' ? '#3f3f46' : '#f4f4f5'};
      border-color: #3b82f6;
    }
    
    .toggle-switch {
      width: 48px;
      height: 26px;
      background: ${autoTheme ? '#3b82f6' : (theme === 'dark' ? '#52525b' : '#d4d4d8')};
      border-radius: 13px;
      position: relative;
      transition: all 0.3s ease;
    }
    
    .toggle-slider {
      width: 22px;
      height: 22px;
      background: white;
      border-radius: 50%;
      position: absolute;
      top: 2px;
      left: ${autoTheme ? '24px' : '2px'};
      transition: all 0.3s ease;
      box-shadow: 0 2px 6px rgba(0,0,0,0.3);
    }
    
    .toggle-label {
      flex: 1;
      font-size: 0.9375rem;
      color: ${theme === 'dark' ? '#e4e4e7' : '#18181b'};
      font-weight: 600;
    }
  `;

  return (
    <>
      <style>{styles}</style>
      <div className="popup-container">
        <div className="header">
          <div className="header-content">
            <div className="brand">
              <div className="logo-icon">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="brand-text">
                <h1>Resume Analyzer</h1>
                <p>AI-powered career intelligence</p>
              </div>
            </div>
            
            <div className="header-actions">
              <button className="theme-toggle" onClick={toggleTheme}>
                {theme === 'dark' ? (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path d="M12 18C8.68629 18 6 15.3137 6 12C6 8.68629 8.68629 6 12 6C15.3137 6 18 8.68629 18 12C18 15.3137 15.3137 18 12 18ZM12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8C9.79086 8 8 9.79086 8 12C8 14.2091 9.79086 16 12 16ZM11 1H13V4H11V1ZM11 20H13V23H11V20ZM3.51472 4.92893L4.92893 3.51472L7.05025 5.63604L5.63604 7.05025L3.51472 4.92893ZM16.9497 18.364L18.364 16.9497L20.4853 19.0711L19.0711 20.4853L16.9497 18.364ZM19.0711 3.51472L20.4853 4.92893L18.364 7.05025L16.9497 5.63604L19.0711 3.51472ZM5.63604 16.9497L7.05025 18.364L4.92893 20.4853L3.51472 19.0711L5.63604 16.9497ZM23 11V13H20V11H23ZM4 11V13H1V11H4Z"/>
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path d="M10 7C10 10.866 13.134 14 17 14C18.9584 14 20.729 13.1957 21.9995 11.8995C22 11.933 22 11.9665 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C12.0335 2 12.067 2 12.1005 2.00049C10.8043 3.27098 10 5.04157 10 7ZM4 12C4 16.4183 7.58172 20 12 20C15.0583 20 17.7158 18.2839 19.062 15.7621C18.3945 15.9187 17.7035 16 17 16C12.0294 16 8 11.9706 8 7C8 6.29648 8.08133 5.60547 8.2379 4.938C5.71611 6.28423 4 8.9417 4 12Z"/>
                  </svg>
                )}
              </button>
            </div>
          </div>
          <div className="header-decoration"></div>
        </div>
        
        {resumeUploaded && (
          <div className="resume-bar">
            <div className="resume-info">
              <div className="resume-icon">📄</div>
              <div className="resume-details">
                <div className="resume-name">{resumeFileName}</div>
                <div className="resume-label">Resume Loaded</div>
              </div>
            </div>
            <div className="resume-actions">
              <button className="btn-small" onClick={() => setShowResumeUpload(true)}>Update</button>
              <button className="btn-small" onClick={clearResume}>Clear</button>
            </div>
          </div>
        )}
        
        <div className="content">
          <div className="tabs">
            <div className={`tab ${activeTab === 'job' ? 'active' : ''}`} onClick={() => setActiveTab('job')}>
              Your Job
            </div>
            <div className={`tab ${activeTab === 'history' ? 'active' : ''}`} onClick={() => setActiveTab('history')}>
              History
            </div>
            <div className={`tab ${activeTab === 'settings' ? 'active' : ''}`} onClick={() => setActiveTab('settings')}>
              Settings
            </div>
          </div>

          <div className={`tab-content ${activeTab === 'job' ? 'active' : ''}`}>
            {!resumeUploaded ? (
              <div className="empty-state">
                <div className="empty-state-icon">📄</div>
                <h3 style={{marginBottom: '8px', fontSize: '1.125rem', fontWeight: '700'}}>Upload Your Resume First</h3>
                <p style={{marginBottom: '24px', fontSize: '0.875rem'}}>To start analyzing jobs, please upload your resume</p>
                <button 
                  className="extract-btn" 
                  onClick={() => setShowResumeUpload(true)}
                  style={{maxWidth: '280px', margin: '0 auto'}}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="17 8 12 3 7 8"></polyline>
                    <line x1="12" y1="3" x2="12" y2="15"></line>
                  </svg>
                  Upload Resume
                </button>
              </div>
            ) : (
              <>
                <div className="section-title">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"></path>
                    <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                    <line x1="12" y1="22.08" x2="12" y2="12"></line>
                  </svg>
                  Extract Job Details
                </div>
                
                <button className="extract-btn" onClick={extractCurrentPage} disabled={extracting}>
                  {extracting ? (
                    <>
                      <span className="loading-spinner"></span>
                      <span>Extracting...</span>
                    </>
                  ) : (
                    <>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                        <polyline points="7 10 12 15 17 10"></polyline>
                        <line x1="12" y1="15" x2="12" y2="3"></line>
                      </svg>
                      <span>Extract from Current Page</span>
                    </>
                  )}
                </button>

                <div className="section-title" style={{marginTop: '28px'}}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"></path>
                    <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                  </svg>
                  Job Information
                </div>

                <input
                  type="text"
                  placeholder="Job Title (e.g., Senior Software Engineer)"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Company Name (e.g., Google)"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                />
                <textarea
                  value={jobDescText}
                  onChange={(e) => setJobDescText(e.target.value)}
                  placeholder="Paste job description here or use Extract button above..."
                />

                <button
                  className="analyze-btn"
                  onClick={analyze}
                  disabled={loading || !resumeUploaded || !keysSaved || !jobDescText.trim()}
                >
                  {loading ? <span className="loading-spinner"></span> : 'Analyze Job Match'}
                </button>

                {error && <div className="error-message">{error}</div>}

                {analysisResult && (
                  <div style={{marginTop: '28px'}}>
                    {analysisResult.recommendation && (() => {
                      const style = getRecommendationStyle(analysisResult.recommendation);
                      return (
                        <div 
                          className="recommendation-badge" 
                          style={{
                            background: style.bg,
                            border: `2px solid ${style.border}`,
                            color: style.color
                          }}
                        >
                          {style.text}
                        </div>
                      );
                    })()}
                    
                    <div className="score-container">
                      <div className="score-circle" style={{ '--score': analysisResult.matchScore }}>
                        {analysisResult.matchScore}%
                      </div>
                      <div className="score-label">Match Score</div>
                    </div>
                    <p className="report-summary">{analysisResult.summary}</p>
                    
                    {analysisResult.recommendation && analysisResult.recommendationReasons && (
                      <div className="report-section recommendation">
                        <div className="report-section-header" onClick={() => toggleSection('recommendation')}>
                          <h3>AI Recommendation</h3>
                          <div className={`chevron ${expandedSections.recommendation ? 'rotated' : ''}`}></div>
                        </div>
                        {expandedSections.recommendation && (
                          <ul>
                            {analysisResult.recommendationReasons.map((item, i) => <li key={i}>{item}</li>)}
                          </ul>
                        )}
                      </div>
                    )}
                    
                    <div className="report-section strengths">
                      <div className="report-section-header" onClick={() => toggleSection('strengths')}>
                        <h3>Strengths</h3>
                        <div className={`chevron ${expandedSections.strengths ? 'rotated' : ''}`}></div>
                      </div>
                      {expandedSections.strengths && (
                        <ul>
                          {analysisResult.strengths?.map((item, i) => <li key={i}>{item}</li>)}
                        </ul>
                      )}
                    </div>

                    <div className="report-section improvements">
                      <div className="report-section-header" onClick={() => toggleSection('improvements')}>
                        <h3>Improvements</h3>
                        <div className={`chevron ${expandedSections.improvements ? 'rotated' : ''}`}></div>
                      </div>
                      {expandedSections.improvements && (
                        <ul>
                          {analysisResult.improvements?.map((item, i) => <li key={i}>{item}</li>)}
                        </ul>
                      )}
                    </div>

                    {analysisResult.missingKeywords && analysisResult.missingKeywords.length > 0 && (
                      <div className="report-section keywords">
                        <div className="report-section-header" onClick={() => toggleSection('keywords')}>
                          <h3>Missing Keywords</h3>
                          <div className={`chevron ${expandedSections.keywords ? 'rotated' : ''}`}></div>
                        </div>
                        {expandedSections.keywords && (
                          <>
                            <ul>
                              {analysisResult.missingKeywords.map((item, i) => <li key={i}>{item}</li>)}
                            </ul>
                            <button 
                              className="btn-small" 
                              style={{margin: '8px 14px 14px 14px', width: 'calc(100% - 28px)'}}
                              onClick={() => copyToClipboard(analysisResult.missingKeywords.join(', '))}
                            >
                              Copy Keywords
                            </button>
                          </>
                        )}
                      </div>
                    )}

                    {analysisResult.atsWarnings && analysisResult.atsWarnings.length > 0 && (
                      <div className="report-section ats">
                        <div className="report-section-header" onClick={() => toggleSection('ats')}>
                          <h3>ATS Warnings</h3>
                          <div className={`chevron ${expandedSections.ats ? 'rotated' : ''}`}></div>
                        </div>
                        {expandedSections.ats && (
                          <ul>
                            {analysisResult.atsWarnings.map((item, i) => <li key={i}>{item}</li>)}
                          </ul>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>

          <div className={`tab-content ${activeTab === 'history' ? 'active' : ''}`}>
            <div className="section-title">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
              Analysis History ({jobHistory.length})
            </div>
            {jobHistory.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">📊</div>
                <h3 style={{marginBottom: '8px', fontSize: '1.125rem', fontWeight: '700'}}>No History Yet</h3>
                <p style={{fontSize: '0.875rem'}}>Start analyzing jobs to see your history here</p>
              </div>
            ) : (
              jobHistory.map(job => (
                <div key={job.id} className="history-item">
                  <div className="history-header">
                    <div>
                      <div className="history-title">{job.jobTitle}</div>
                      <div className="history-company">🏢 {job.company}</div>
                    </div>
                    <div className="history-score">{job.matchScore}%</div>
                  </div>
                  <div className="history-meta">
                    <span>📅 {new Date(job.analyzedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    <span 
                      className={`status-badge status-${job.status}`}
                      onClick={() => {
                        const statuses = ['pending', 'applied', 'interview', 'rejected'];
                        const currentIndex = statuses.indexOf(job.status);
                        const nextStatus = statuses[(currentIndex + 1) % statuses.length];
                        updateJobStatus(job.id, nextStatus);
                      }}
                    >
                      {job.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className={`tab-content ${activeTab === 'settings' ? 'active' : ''}`}>
            <div className="section-title">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 15a3 3 0 100-6 3 3 0 000 6z"></path>
                <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"></path>
              </svg>
              API Configuration
            </div>
            <input
              type="password"
              placeholder="Enter your Gemini API key"
              value={apiKeyGemini}
              onChange={(e) => setApiKeyGemini(e.target.value)}
            />
            <button onClick={saveKeys} style={{ width: '100%', background: 'linear-gradient(135deg, #10b981, #059669)', color: 'white', border: 'none', padding: '14px', borderRadius: '12px', fontWeight: '700', fontSize: '0.9375rem' }}>
              Save API Key
            </button>
            <div className="info-box">
              🔑 Get your free API key from <a href="https://makersuite.google.com/app/apikey" target="_blank" rel="noopener noreferrer">Google AI Studio</a>
            </div>
            {keysSaved && (
              <div className="success-box">
                ✓ API key saved successfully
              </div>
            )}
            
            <div className="section-title" style={{marginTop: '32px'}}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="5"></circle>
                <line x1="12" y1="1" x2="12" y2="3"></line>
                <line x1="12" y1="21" x2="12" y2="23"></line>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                <line x1="1" y1="12" x2="3" y2="12"></line>
                <line x1="21" y1="12" x2="23" y2="12"></line>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
              </svg>
              Appearance
            </div>
            <div className="auto-theme-toggle" onClick={toggleAutoTheme}>
              <div className="toggle-switch">
                <div className="toggle-slider"></div>
              </div>
              <div className="toggle-label">
                Auto Theme (System)
              </div>
            </div>
          </div>
        </div>
      </div>

      {showResumeUpload && (
        <div className="upload-modal" onClick={() => setShowResumeUpload(false)}>
          <div className="upload-modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Upload Resume</h3>
            <input type="file" accept="application/pdf" onChange={handlePDFUpload} />
            <div className="modal-actions">
              <button className="btn-small" onClick={() => setShowResumeUpload(false)} style={{flex: 1}}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default App;
