// Analysis Types
export interface AnalysisResult {
    matchScore: number;
    recommendation: 'strongly_apply' | 'apply' | 'consider' | 'not_recommended';
    recommendationReasons: string[];
    summary: string;
    strengths: string[];
    improvements: string[];
    missingKeywords: string[];
    atsWarnings: string[];
    interviewTips?: string[];
    skillsToHighlight?: string[];
}

export interface JobHistoryItem {
    id: number;
    jobTitle: string;
    company: string;
    matchScore: number;
    analyzedAt: number;
    url: string;
    status: 'pending' | 'applied' | 'interview' | 'rejected' | 'offer';
    fullAnalysis: AnalysisResult;
}

export interface CachedResume {
    text: string;
    fileName: string;
    uploadedAt: number;
}

export interface ExtractedJob {
    text: string;
    title: string;
    company?: string;
    url: string;
    extractedAt: number;
}

// Cover Letter Types
export interface CoverLetterRequest {
    resumeText: string;
    jobDescription: string;
    jobTitle: string;
    company: string;
    tone?: 'professional' | 'friendly' | 'enthusiastic';
    length?: 'short' | 'medium' | 'long';
}

export interface CoverLetterResult {
    content: string;
    wordCount: number;
    generatedAt: number;
}

// UI State Types
export interface ExpandedSections {
    strengths: boolean;
    improvements: boolean;
    keywords: boolean;
    ats: boolean;
    recommendation: boolean;
    interviewTips: boolean;
}

export type Theme = 'dark' | 'light';
export type ActiveTab = 'job' | 'history' | 'settings';
