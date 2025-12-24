import React, { useState, useEffect, useCallback } from 'react';
import { getDocument } from 'pdfjs-dist/legacy/build/pdf';
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf';
import pdfjsWorker from 'pdfjs-dist/legacy/build/pdf.worker?url';
import {
    Theme,
    ActiveTab,
    AnalysisResult,
    JobHistoryItem,
    ExpandedSections,
    CachedResume,
    ExtractedJob,
    CoverLetterRequest,
    CoverLetterResult,
} from './types';
import { Header } from './components/Header';
import { TabNavigation } from './components/TabNavigation';
import { AnalysisResultView } from './components/AnalysisResult';
import { CoverLetterPanel } from './components/CoverLetterPanel';
import { Icons } from './components/Icons';
import styles from './App.module.css';

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

declare const chrome: {
    runtime?: {
        id?: string;
        lastError?: { message: string };
        sendMessage: (message: unknown, callback: (response: unknown) => void) => void;
    };
    storage?: {
        sync: {
            get: (keys: string[], callback: (result: Record<string, unknown>) => void) => void;
            set: (items: Record<string, unknown>, callback?: () => void) => void;
        };
        local: {
            get: (keys: string[], callback: (result: Record<string, unknown>) => void) => void;
            set: (items: Record<string, unknown>, callback?: () => void) => void;
            remove: (keys: string | string[]) => void;
        };
    };
    tabs?: {
        query: (queryInfo: { active: boolean; currentWindow: boolean }) => Promise<{ id: number }[]>;
    };
    scripting?: {
        executeScript: (params: { target: { tabId: number }; func: () => unknown }) => Promise<{ result: unknown }[]>;
    };
};

const App: React.FC = () => {
    const [theme, setTheme] = useState<Theme>('dark');
    const [autoTheme, setAutoTheme] = useState(true);
    const [resumeText, setResumeText] = useState('');
    const [resumeFileName, setResumeFileName] = useState('');
    const [resumeUploaded, setResumeUploaded] = useState(false);
    const [jobDescText, setJobDescText] = useState('');
    const [jobTitle, setJobTitle] = useState('');
    const [company, setCompany] = useState('');
    const [currentUrl, setCurrentUrl] = useState('');
    const [apiKeyGemini, setApiKeyGemini] = useState('');
    const [keysSaved, setKeysSaved] = useState(false);
    const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
    const [loading, setLoading] = useState(false);
    const [extracting, setExtracting] = useState(false);
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState<ActiveTab>('job');
    const [showResumeUpload, setShowResumeUpload] = useState(false);
    const [expandedSections, setExpandedSections] = useState<ExpandedSections>({
        strengths: true,
        improvements: true,
        keywords: false,
        ats: false,
        recommendation: true,
        interviewTips: false,
    });
    const [jobHistory, setJobHistory] = useState<JobHistoryItem[]>([]);

    const isExtension = typeof chrome !== 'undefined' && chrome.runtime?.id;

    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleThemeChange = (e: MediaQueryListEvent) => {
            if (autoTheme) setTheme(e.matches ? 'dark' : 'light');
        };
        if (autoTheme) setTheme(mediaQuery.matches ? 'dark' : 'light');
        mediaQuery.addEventListener('change', handleThemeChange);
        return () => mediaQuery.removeEventListener('change', handleThemeChange);
    }, [autoTheme]);

    useEffect(() => {
        if (isExtension && chrome.storage) {
            chrome.storage.sync.get(['geminiKey', 'theme', 'autoTheme'], (result) => {
                if (result.geminiKey) { setApiKeyGemini(result.geminiKey as string); setKeysSaved(true); }
                if (result.autoTheme !== undefined) setAutoTheme(result.autoTheme as boolean);
                if (result.theme && !result.autoTheme) setTheme(result.theme as Theme);
            });
            chrome.storage.local.get(['cachedResume', 'lastExtractedJob', 'jobHistory'], (result) => {
                if (result.cachedResume) {
                    const resume = result.cachedResume as CachedResume;
                    setResumeText(resume.text);
                    setResumeFileName(resume.fileName || 'Resume');
                    setResumeUploaded(true);
                }
                if (result.lastExtractedJob) {
                    const job = result.lastExtractedJob as ExtractedJob;
                    setJobDescText(job.text);
                    setJobTitle(job.title || '');
                    setCompany(job.company || '');
                    setCurrentUrl(job.url || '');
                }
                if (result.jobHistory) setJobHistory(result.jobHistory as JobHistoryItem[]);
            });
        }
    }, [isExtension]);

    const toggleTheme = useCallback(() => {
        if (autoTheme) setAutoTheme(false);
        const newTheme: Theme = theme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
        if (isExtension && chrome.storage) chrome.storage.sync.set({ theme: newTheme, autoTheme: false });
    }, [autoTheme, theme, isExtension]);

    const extractCurrentPage = async () => {
        if (!resumeUploaded) { alert('Please upload your resume first'); setShowResumeUpload(true); return; }
        if (!isExtension) { alert('This feature only works in the Chrome extension'); return; }
        setExtracting(true);
        try {
            const [tab] = await chrome.tabs!.query({ active: true, currentWindow: true });
            const results = await chrome.scripting!.executeScript({
                target: { tabId: tab.id },
                func: () => ({ text: document.body.innerText, title: document.title, url: window.location.href }),
            });
            if (results?.[0]) {
                const { text, title, url } = results[0].result as { text: string; title: string; url: string };
                setJobDescText(text);
                setJobTitle(title);
                setCurrentUrl(url);
                const urlMatch = url.match(/(?:https?:\/\/)?(?:www\.)?([^\/]+)/);
                if (urlMatch) setCompany(urlMatch[1].split('.')[0]);
                chrome.storage!.local.set({ lastExtractedJob: { text, title, url, extractedAt: Date.now() } });
            }
        } catch { setError('Failed to extract page content'); } finally { setExtracting(false); }
    };

    const handlePDFUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file?.type === 'application/pdf') {
            setLoading(true); setError('');
            try {
                const arrayBuffer = await file.arrayBuffer();
                const pdf = await getDocument(arrayBuffer).promise;
                let text = '';
                for (let i = 1; i <= pdf.numPages; i++) {
                    const page = await pdf.getPage(i);
                    const content = await page.getTextContent();
                    text += content.items.map((item) => (item as { str?: string }).str || '').join(' ') + '\n';
                }
                setResumeText(text); setResumeFileName(file.name); setResumeUploaded(true); setShowResumeUpload(false);
                if (isExtension && chrome.storage) chrome.storage.local.set({ cachedResume: { text, fileName: file.name, uploadedAt: Date.now() } });
            } catch { setError('Error processing PDF'); } finally { setLoading(false); }
        }
    };

    const saveKeys = () => {
        if (!apiKeyGemini) { alert('Please enter your API key'); return; }
        if (isExtension && chrome.storage) chrome.storage.sync.set({ geminiKey: apiKeyGemini }, () => setKeysSaved(true));
        else setKeysSaved(true);
    };

    const analyze = () => {
        if (!resumeUploaded) { alert('Please upload your resume first'); setShowResumeUpload(true); return; }
        if (!keysSaved) { alert('Please add your API key in Settings'); setActiveTab('settings'); return; }
        if (!jobDescText.trim()) { alert('Please add a job description'); return; }

        setLoading(true); setError(''); setAnalysisResult(null);
        if (!isExtension || !chrome.runtime) { setError('Extension required'); setLoading(false); return; }

        chrome.runtime.sendMessage(
            { type: 'analyze', resumeText, websiteText: jobDescText, jobTitle, company, url: currentUrl },
            (res: unknown) => {
                const response = res as { success: boolean; reply?: string; error?: string };
                if (chrome.runtime?.lastError) setError(chrome.runtime.lastError.message);
                else if (response?.success) {
                    try {
                        setAnalysisResult(JSON.parse(response.reply!) as AnalysisResult);
                        chrome.storage!.local.get(['jobHistory'], (s) => setJobHistory((s.jobHistory as JobHistoryItem[]) || []));
                    } catch { setError('Failed to parse response'); }
                } else setError(response?.error || 'Analysis failed');
                setLoading(false);
            }
        );
    };

    const updateJobStatus = (jobId: number, status: JobHistoryItem['status']) => {
        if (!isExtension || !chrome.runtime) return;
        chrome.runtime.sendMessage({ type: 'updateJobStatus', jobId, status }, () => {
            chrome.storage!.local.get(['jobHistory'], (s) => setJobHistory((s.jobHistory as JobHistoryItem[]) || []));
        });
    };

    const toggleSection = (section: keyof ExpandedSections) => setExpandedSections((p) => ({ ...p, [section]: !p[section] }));
    const copyToClipboard = (text: string) => { navigator.clipboard.writeText(text); };
    const clearResume = () => { setResumeText(''); setResumeFileName(''); setResumeUploaded(false); if (isExtension && chrome.storage) chrome.storage.local.remove('cachedResume'); };

    const exportAnalysis = () => {
        if (!analysisResult) return;
        const text = `
JOB MATCH ANALYSIS
==================
Job: ${jobTitle} at ${company}
Match Score: ${analysisResult.matchScore}%
Recommendation: ${analysisResult.recommendation.replace('_', ' ').toUpperCase()}

Summary: ${analysisResult.summary}

STRENGTHS:
${analysisResult.strengths?.map(s => `• ${s}`).join('\n') || 'None'}

AREAS TO IMPROVE:
${analysisResult.improvements?.map(s => `• ${s}`).join('\n') || 'None'}

MISSING KEYWORDS:
${analysisResult.missingKeywords?.join(', ') || 'None'}

INTERVIEW TIPS:
${analysisResult.interviewTips?.map(s => `• ${s}`).join('\n') || 'Not available'}

Generated by JobFit AI
    `.trim();
        navigator.clipboard.writeText(text);
        alert('Analysis copied to clipboard!');
    };

    const generateCoverLetter = async (request: CoverLetterRequest): Promise<CoverLetterResult> => {
        return new Promise((resolve, reject) => {
            if (!isExtension || !chrome.runtime) { reject(new Error('Extension required')); return; }
            chrome.runtime.sendMessage({ type: 'generateCoverLetter', request }, (res: unknown) => {
                const response = res as { success: boolean; coverLetter?: CoverLetterResult; error?: string };
                if (response?.success && response.coverLetter) resolve(response.coverLetter);
                else reject(new Error(response?.error || 'Failed'));
            });
        });
    };

    const deleteHistoryItem = (jobId: number) => {
        if (!isExtension || !chrome.storage) return;
        const updated = jobHistory.filter(j => j.id !== jobId);
        chrome.storage.local.set({ jobHistory: updated });
        setJobHistory(updated);
    };

    return (
        <div className={styles.container} data-theme={theme}>
            <Header theme={theme} onThemeToggle={toggleTheme} resumeUploaded={resumeUploaded} resumeFileName={resumeFileName} onUpdateResume={() => setShowResumeUpload(true)} onClearResume={clearResume} />

            <main className={styles.content}>
                <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

                {activeTab === 'job' && (
                    <div className={styles.tabContent}>
                        {!resumeUploaded ? (
                            <div className={styles.emptyState}>
                                <div className={styles.emptyIcon}><Icons.FileText size={32} /></div>
                                <h3>Upload Your Resume</h3>
                                <p>Upload your resume to start analyzing job matches</p>
                                <button className={styles.primaryBtn} onClick={() => setShowResumeUpload(true)}>
                                    <Icons.Upload size={16} /> Upload Resume
                                </button>
                            </div>
                        ) : (
                            <>
                                <div className={styles.sectionTitle}><Icons.Download size={14} /> Extract Job</div>
                                <button className={styles.extractBtn} onClick={extractCurrentPage} disabled={extracting}>
                                    {extracting ? <><Icons.Loader2 size={16} className={styles.spinner} /> Extracting...</> : <><Icons.Download size={16} /> Extract from Current Page</>}
                                </button>

                                <div className={styles.sectionTitle}><Icons.Briefcase size={14} /> Job Details</div>
                                <input type="text" className={styles.input} placeholder="Job Title" value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} />
                                <input type="text" className={styles.input} placeholder="Company" value={company} onChange={(e) => setCompany(e.target.value)} />
                                <textarea className={`${styles.input} ${styles.textarea}`} value={jobDescText} onChange={(e) => setJobDescText(e.target.value)} placeholder="Paste job description..." />

                                <button className={styles.analyzeBtn} onClick={analyze} disabled={loading || !keysSaved || !jobDescText.trim()}>
                                    {loading ? <Icons.Loader2 size={18} className={styles.spinner} /> : <><Icons.Sparkles size={18} /> Analyze Match</>}
                                </button>

                                {error && <div className={styles.errorMessage}><Icons.AlertTriangle size={14} /> {error}</div>}

                                {analysisResult && (
                                    <div style={{ marginTop: 20 }}>
                                        <AnalysisResultView result={analysisResult} expandedSections={expandedSections} onToggleSection={toggleSection} onCopyKeywords={() => copyToClipboard(analysisResult.missingKeywords?.join(', ') || '')} />
                                        <button className={styles.exportBtn} onClick={exportAnalysis}><Icons.Copy size={14} /> Copy Analysis Report</button>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                )}

                {activeTab === 'cover-letter' && (
                    <div className={styles.tabContent}>
                        <CoverLetterPanel resumeText={resumeText} jobDescription={jobDescText} jobTitle={jobTitle} company={company} isPro={true} onGenerate={generateCoverLetter} onUpgrade={() => { }} />
                    </div>
                )}

                {activeTab === 'history' && (
                    <div className={styles.tabContent}>
                        <div className={styles.sectionTitle}><Icons.History size={14} /> History ({jobHistory.length})</div>
                        {jobHistory.length === 0 ? (
                            <div className={styles.emptyState}>
                                <div className={styles.emptyIcon}><Icons.History size={32} /></div>
                                <h3>No History</h3>
                                <p>Analyzed jobs will appear here</p>
                            </div>
                        ) : (
                            <div className={styles.historyList}>
                                {jobHistory.map((job) => (
                                    <div key={job.id} className={styles.historyItem}>
                                        <div className={styles.historyHeader}>
                                            <div className={styles.historyInfo}>
                                                <h4 className={styles.historyTitle}>{job.jobTitle}</h4>
                                                <p className={styles.historyCompany}><Icons.Briefcase size={10} /> {job.company}</p>
                                            </div>
                                            <div className={styles.historyScore}>{job.matchScore}%</div>
                                        </div>
                                        <div className={styles.historyMeta}>
                                            <span className={styles.historyDate}><Icons.Clock size={10} /> {new Date(job.analyzedAt).toLocaleDateString()}</span>
                                            <button className={`${styles.statusBadge} ${styles[`status-${job.status}`]}`} onClick={() => { const s: JobHistoryItem['status'][] = ['pending', 'applied', 'interview', 'rejected', 'offer']; updateJobStatus(job.id, s[(s.indexOf(job.status) + 1) % s.length]); }}>{job.status}</button>
                                            <button className={styles.deleteBtn} onClick={() => deleteHistoryItem(job.id)}><Icons.X size={12} /></button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'settings' && (
                    <div className={styles.tabContent}>
                        <div className={styles.sectionTitle}><Icons.Settings size={14} /> API Key</div>
                        <input type="password" className={styles.input} placeholder="Gemini API Key" value={apiKeyGemini} onChange={(e) => setApiKeyGemini(e.target.value)} />
                        <button className={styles.saveBtn} onClick={saveKeys}><Icons.Check size={16} /> Save Key</button>
                        <div className={styles.infoBox}><Icons.Zap size={14} /> Get your free API key from <a href="https://makersuite.google.com/app/apikey" target="_blank" rel="noopener noreferrer">Google AI Studio</a></div>
                        {keysSaved && <div className={styles.successBox}><Icons.Check size={14} /> API key saved</div>}

                        <div className={styles.sectionTitle} style={{ marginTop: 24 }}><Icons.Sun size={14} /> Theme</div>
                        <button className={styles.themeOption} onClick={() => setAutoTheme(!autoTheme)}>
                            <div className={styles.themeToggle}><div className={`${styles.toggleSwitch} ${autoTheme ? styles.active : ''}`}><div className={styles.toggleSlider} /></div></div>
                            <span>Auto (System)</span>
                        </button>
                    </div>
                )}
            </main>

            {showResumeUpload && (
                <div className={styles.modal} onClick={() => setShowResumeUpload(false)}>
                    <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.modalHeader}><Icons.Upload size={20} /><h3>Upload Resume</h3></div>
                        <p className={styles.modalDesc}>Upload your resume as PDF</p>
                        <label className={styles.fileInput}>
                            <input type="file" accept="application/pdf" onChange={handlePDFUpload} />
                            <div className={styles.fileInputContent}><Icons.FileText size={28} /><span>Click to upload PDF</span></div>
                        </label>
                        <button className={styles.cancelBtn} onClick={() => setShowResumeUpload(false)}>Cancel</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default App;
