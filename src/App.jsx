import { useState, useEffect } from "react";
import { getDocument } from "pdfjs-dist/legacy/build/pdf";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf";
import pdfjsWorker from "pdfjs-dist/legacy/build/pdf.worker?url";

// Set PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

function App() {
  const [resumeText, setResumeText] = useState("");
  const [jobDescText, setJobDescText] = useState("");
  const [apiKeyGemini, setApiKeyGemini] = useState("");
  const [analysisResult, setAnalysisResult] = useState(null); // State for structured JSON result
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [keysSaved, setKeysSaved] = useState(false);
  const [resumeUploaded, setResumeUploaded] = useState(false);
  const [activeTab, setActiveTab] = useState("resume");

  // A simple check to see if we're in the Chrome extension environment
  const isExtension = typeof chrome !== "undefined" && chrome.runtime && chrome.runtime.id;

  // Load saved API key on startup
  useEffect(() => {
    // ⬇️ FIX 1: Check if running as an extension before using chrome API
    if (isExtension) {
      chrome.storage.sync.get(['geminiKey'], (result) => {
        if (result.geminiKey) {
          setApiKeyGemini(result.geminiKey);
          setKeysSaved(true);
        }
      });
    }
  }, [isExtension]);

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
        setResumeUploaded(true);
      } catch (err) {
        setError("Error processing PDF. Please try another file.");
        console.error("Error processing PDF:", err);
      } finally {
        setLoading(false);
      }
    } else {
      alert("Please upload a valid PDF file.");
    }
  };

  const saveKeys = () => {
    if (!apiKeyGemini) {
      alert("Please enter your Gemini API key");
      return;
    }
    // ⬇️ FIX 2: Check if running as an extension
    if (isExtension) {
      chrome.storage.sync.set({ geminiKey: apiKeyGemini }, () => {
        alert("Gemini API Key Saved!");
        setKeysSaved(true);
      });
    } else {
      // Provide feedback for local development
      alert("Running in dev mode. Key not saved to Chrome storage.");
      setKeysSaved(true); // Pretend it's saved for UI purposes
    }
  };

  const analyze = () => {
    if (!resumeUploaded || !keysSaved || !jobDescText.trim()) {
      alert("Please upload a resume, save your API key, and provide a job description.");
      return;
    }
    setLoading(true);
    setError("");
    setAnalysisResult(null);

    // ⬇️ FIX 3: Check if running as an extension
    if (!isExtension) {
      setError("Analysis only works inside the Chrome extension. This is a preview.");
      setLoading(false);
      // You can even set mock data here for testing the UI
      setAnalysisResult({
        matchScore: 75,
        summary: "This is a mock analysis for development purposes.",
        strengths: ["Shows strong React skills.", "Good project experience."],
        improvements: ["Quantify achievements.", "Add more keywords."]
      });
      return;
    }

    chrome.runtime.sendMessage(
      {
        type: "analyze",
        resumeText,
        websiteText: jobDescText,
        model: "gemini", // Model is fixed to Gemini
      },
      (res) => {
        if (chrome.runtime.lastError) {
          setError(`Error: ${chrome.runtime.lastError.message}`);
          console.error(chrome.runtime.lastError);
        } else if (res && res.success) {
          try {
            const parsedResult = JSON.parse(res.reply);
            setAnalysisResult(parsedResult);
          } catch (e) {
            setError("Failed to parse the analysis report from the AI. Please try again.");
            console.error("JSON Parsing Error:", e, "Raw response:", res.reply);
          }
        } else {
          setError((res && res.error) || "An unknown error occurred during analysis.");
        }
        setLoading(false);
      }
    );
  };

  // --- STYLES (No changes needed here) ---
  const styles = `
  /* ... CSS code ... */
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
    @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css');
    
    :root {
      --primary: #00A3FF; --primary-dark: #007acc; --secondary: #8A2BE2; --success: #00C49A;
      --danger: #FF4757; --warning: #FFC300; --dark-bg: #050505; --dark-card: #121212;
      --dark-border: #2d2d2d; --dark-text: #E0E0E0; --dark-muted: #888888;
      --card-shadow: 0 8px 32px rgba(0, 0, 0, 0.37); --glow: 0 0 20px rgba(0, 163, 255, 0.3);
      --transition: all 0.3s ease;
    }
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Inter', sans-serif; background: var(--dark-bg); color: var(--dark-text); line-height: 1.6; width: 500px; margin: auto; overflow: hidden; }
    .popup-container { width: 100%; background: var(--dark-card); border-radius: 16px; box-shadow: var(--card-shadow); border: 1px solid var(--dark-border); display: flex; flex-direction: column; max-height: 600px; }
    .header { background: linear-gradient(135deg, var(--primary), var(--secondary)); color: white; padding: 24px; text-align: center; border-bottom: 1px solid var(--dark-border); }
    .header h1 { font-size: 1.6rem; font-weight: 700; }
    .header p { font-size: 0.9rem; opacity: 0.8; font-weight: 400; }
    .content { padding: 20px; overflow-y: auto; flex-grow: 1; }
    .content::-webkit-scrollbar { width: 6px; }
    .content::-webkit-scrollbar-track { background: transparent; }
    .content::-webkit-scrollbar-thumb { background-color: var(--dark-border); border-radius: 20px; }
    .tabs { display: flex; margin-bottom: 20px; background: var(--dark-bg); border-radius: 12px; padding: 5px; border: 1px solid var(--dark-border); }
    .tab { flex: 1; padding: 10px; text-align: center; cursor: pointer; border-radius: 9px; font-weight: 500; transition: var(--transition); color: var(--dark-muted); display: flex; align-items: center; justify-content: center; gap: 8px; }
    .tab:hover { color: var(--dark-text); background: var(--dark-border); }
    .tab.active { background: var(--primary); color: white; box-shadow: var(--glow); }
    .tab-content { display: none; }
    .tab-content.active { display: block; animation: fadeIn 0.5s ease; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
    .section { margin-bottom: 20px; }
    button { padding: 12px 20px; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; transition: var(--transition); display: flex; align-items: center; justify-content: center; font-size: 0.95rem; gap: 8px; }
    .analyze-btn { background: linear-gradient(135deg, var(--primary), var(--secondary)); color: white; width: 100%; padding: 16px; font-size: 1.05rem; }
    .analyze-btn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(0, 0, 0, 0.4); }
    .analyze-btn:disabled { background: var(--dark-border); cursor: not-allowed; color: var(--dark-muted); }
    textarea, input[type="password"] { width: 100%; padding: 12px; border: 1px solid var(--dark-border); border-radius: 8px; font-family: inherit; font-size: 0.9rem; transition: var(--transition); background-color: var(--dark-bg); color: var(--dark-text); }
    textarea:focus, input[type="password"]:focus { outline: none; border-color: var(--primary); box-shadow: var(--glow); }
    textarea { min-height: 120px; resize: vertical; }

    /* NEW ANALYSIS REPORT STYLES */
    .analysis-report {
      margin-top: 24px;
      padding: 20px;
      border: 1px solid var(--dark-border);
      border-radius: 12px;
      background: var(--dark-bg);
    }
    .score-container {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      margin-bottom: 20px;
    }
    .score-circle {
      width: 100px;
      height: 100px;
      border-radius: 50%;
      display: grid;
      place-items: center;
      background: conic-gradient(var(--primary) calc(var(--score) * 3.6deg), var(--dark-border) 0);
      font-size: 2rem;
      font-weight: 700;
      color: var(--dark-text);
    }
    .score-label {
      font-size: 0.9rem;
      color: var(--dark-muted);
      margin-top: 8px;
    }
    .report-summary {
      font-style: italic;
      color: var(--dark-muted);
      text-align: center;
      margin-bottom: 24px;
      padding-bottom: 20px;
      border-bottom: 1px solid var(--dark-border);
    }
    .report-section {
      margin-bottom: 20px;
    }
    .report-section h3 {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 12px;
      font-size: 1.1rem;
    }
    .report-section .fa-thumbs-up { color: var(--success); }
    .report-section .fa-lightbulb { color: var(--warning); }
    .report-section ul {
      list-style-type: none;
      padding-left: 0;
    }
    .report-section li {
      background: var(--dark-card);
      padding: 12px;
      border-radius: 8px;
      margin-bottom: 8px;
      border-left: 3px solid var(--dark-border);
      font-size: 0.9rem;
    }
    .report-section.strengths li { border-left-color: var(--success); }
    .report-section.improvements li { border-left-color: var(--warning); }

    .error-message {
      background: rgba(255, 71, 87, 0.1);
      border: 1px solid var(--danger);
      color: var(--danger);
      padding: 12px;
      border-radius: 8px;
      margin: 16px 0;
      font-size: 0.9rem;
    }
    .loading-dots { display: flex; justify-content: center; align-items: center; gap: 8px; height: 24px; }
    .loading-dots div { width: 8px; height: 8px; border-radius: 50%; background: #fff; animation: bounce 1.4s infinite ease-in-out both; }
    .loading-dots .dot1 { animation-delay: -0.32s; } .loading-dots .dot2 { animation-delay: -0.16s; }
    @keyframes bounce { 0%, 80%, 100% { transform: scale(0); } 40% { transform: scale(1.0); } }
  `;

  return (
    <>
      <style>{styles}</style>
      <div className="popup-container">
        <div className="header">
          <h1>Resume Analyzer</h1>
          <p>Get AI-powered feedback in seconds</p>
        </div>
        <div className="content">
          <div className="tabs">
            <div className={`tab ${activeTab === 'resume' ? 'active' : ''}`} onClick={() => setActiveTab('resume')}>
              <i className="fas fa-file-alt"></i> 1. Resume
            </div>
            <div className={`tab ${activeTab === 'job' ? 'active' : ''}`} onClick={() => setActiveTab('job')}>
              <i className="fas fa-briefcase"></i> 2. Job
            </div>
            <div className={`tab ${activeTab === 'api' ? 'active' : ''}`} onClick={() => setActiveTab('api')}>
              <i className="fas fa-key"></i> 3. Config
            </div>
          </div>

          <div className={`tab-content ${activeTab === 'resume' ? 'active' : ''}`}>
            <h4>Upload your resume (PDF)</h4>
            <input type="file" accept="application/pdf" onChange={handlePDFUpload} />
          </div>

          <div className={`tab-content ${activeTab === 'job' ? 'active' : ''}`}>
            <h4>Paste Job Description</h4>
            <textarea
              value={jobDescText}
              onChange={(e) => setJobDescText(e.target.value)}
              placeholder="Paste the full job description here..."
            />
          </div>

          <div className={`tab-content ${activeTab === 'api' ? 'active' : ''}`}>
            <h4>Gemini API Key</h4>
            <input
              type="password"
              placeholder="Enter your Gemini API key"
              value={apiKeyGemini}
              onChange={(e) => setApiKeyGemini(e.target.value)}
            />
            <button onClick={saveKeys} style={{ width: '100%', marginTop: '10px' }}>
              <i className="fas fa-save"></i> Save Key
            </button>
          </div>

          <div className="section">
            <button
              className="analyze-btn"
              onClick={analyze}
              disabled={loading || !resumeUploaded || !keysSaved || !jobDescText.trim()}
            >
              {loading ? (
                 <div className="loading-dots"><div className="dot1"></div><div className="dot2"></div><div className="dot3"></div></div>
              ) : (
                <><i className="fas fa-rocket"></i> Analyze Now</>
              )}
            </button>
          </div>

          {error && <div className="error-message">{error}</div>}

          {analysisResult && (
            <div className="analysis-report">
              <div className="score-container">
                <div className="score-circle" style={{ '--score': analysisResult.matchScore }}>
                  {analysisResult.matchScore}%
                </div>
                <div className="score-label">Match Score</div>
              </div>
              <p className="report-summary">{analysisResult.summary}</p>
              
              <div className="report-section strengths">
                <h3><i className="fas fa-thumbs-up"></i> Strengths</h3>
                <ul>
                  {analysisResult.strengths.map((item, index) => <li key={index}>{item}</li>)}
                </ul>
              </div>

              <div className="report-section improvements">
                <h3><i className="fas fa-lightbulb"></i> Areas for Improvement</h3>
                <ul>
                  {analysisResult.improvements.map((item, index) => <li key={index}>{item}</li>)}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default App;