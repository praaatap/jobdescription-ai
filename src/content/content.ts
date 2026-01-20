// Content script for JobFit AI Chrome Extension

interface ExtractedJob {
    text: string;
    title: string;
    url: string;
    extractedAt: number;
}

// Listen for messages from popup or background
chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
    if (msg.type === "getText") {
        const text = document.body.innerText || "";
        sendResponse(text);
        return true;
    }

    if (msg.type === "extractJobDesc") {
        const selectedText = window.getSelection()?.toString();
        if (selectedText) {
            const extractedJob: ExtractedJob = {
                text: selectedText,
                title: document.title,
                url: window.location.href,
                extractedAt: Date.now()
            };

            chrome.storage.local.set({ lastExtractedJob: extractedJob });
            sendResponse({ success: true, job: extractedJob });
        } else {
            sendResponse({ success: false, error: 'No text selected' });
        }
        return true;
    }

    if (msg.type === "getPageInfo") {
        sendResponse({
            success: true,
            info: {
                title: document.title,
                url: window.location.href,
                text: document.body.innerText.slice(0, 10000)
            }
        });
        return true;
    }

    return false;
});

// Add floating action button for quick analysis (optional feature)
function injectFloatingButton(): void {
    const jobSites = ['linkedin.com', 'indeed.com', 'glassdoor.com', 'naukri.com', 'monster.com'];
    const isJobSite = jobSites.some(site => window.location.hostname.includes(site));

    if (!isJobSite) return;

    // Create floating button
    const button = document.createElement('div');
    button.id = 'jobfit-ai-fab';
    button.innerHTML = `
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <circle cx="12" cy="12" r="10"/>
      <path d="M12 16v-4"/>
      <path d="M12 8h.01"/>
    </svg>
  `;
    button.title = 'Analyze with JobFit AI';

    // Style the button
    Object.assign(button.style, {
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        width: '56px',
        height: '56px',
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        boxShadow: '0 4px 20px rgba(99, 102, 241, 0.5)',
        zIndex: '999999',
        transition: 'all 0.3s ease'
    });

    button.addEventListener('mouseenter', () => {
        button.style.transform = 'scale(1.1)';
        button.style.boxShadow = '0 8px 30px rgba(99, 102, 241, 0.6)';
    });

    button.addEventListener('mouseleave', () => {
        button.style.transform = 'scale(1)';
        button.style.boxShadow = '0 4px 20px rgba(99, 102, 241, 0.5)';
    });

    button.addEventListener('click', () => {
        chrome.runtime.sendMessage({ type: 'openPopup' });
    });

    document.body.appendChild(button);
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectFloatingButton);
} else {
    injectFloatingButton();
}
