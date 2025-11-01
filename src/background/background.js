// A function to create the detailed prompt for the Gemini API
// This prompt requests a specific JSON structure for easy parsing in your UI.
function createStructuredPrompt(resumeText, jobDescText) {
  return `
    You are an expert career coach. Analyze the provided resume against the given job description.

    You MUST respond ONLY with a valid JSON object with the following structure:
    {
      "matchScore": <number>,
      "summary": "<string>",
      "strengths": ["<string>", "<string>", ...],
      "improvements": ["<string>", "<string>", ...]
    }

    - "matchScore": An integer from 0-100 for how well the resume matches the job.
    - "summary": A one-sentence summary of the candidate's fit.
    - "strengths": An array of specific points where the resume aligns well with the job.
    - "improvements": An array of actionable suggestions to make the resume a better fit for this job.

    ---RESUME---
    ${resumeText}
    ---END RESUME---

    ---JOB DESCRIPTION---
    ${jobDescText}
    ---END JOB DESCRIPTION---
  `;
}


// Listen for messages from the popup (UI)
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  // Handles saving the API key
  if (msg.type === "setKeys") {
    // Note: The previous code used storage.local, your new App.js uses storage.sync.
    // Using storage.sync is generally better for keys. Let's stick to that.
    chrome.storage.sync.set({ geminiKey: msg.geminiKey });
    sendResponse({ success: true });
    return; // End execution for this message type
  }

  // Handles the analysis request
  if (msg.type === "analyze") {
    // Fetch the key from storage right when we need it to avoid errors
    chrome.storage.sync.get(["geminiKey"], async (result) => {
      const apiKey = result.geminiKey;
      if (!apiKey) {
        sendResponse({ success: false, error: "Gemini API key not found. Please save it first." });
        return;
      }

      const { resumeText, websiteText } = msg;
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
            },
          }),
        });

        if (!response.ok) {
          const errorBody = await response.json();
          throw new Error(`API Error: ${errorBody.error.message}`);
        }

        const data = await response.json();
        const llmResponseText = data.candidates[0].content.parts[0].text;
        
        // Success: send the JSON string back to the UI
        sendResponse({ success: true, reply: llmResponseText });

      } catch (error) {
        console.error("Error calling Gemini API:", error);
        sendResponse({ success: false, error: error.message });
      }
    });

    return true; 
  }
});