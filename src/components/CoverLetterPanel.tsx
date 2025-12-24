import React, { useState } from 'react';
import { CoverLetterRequest, CoverLetterResult } from '../types';
import { Icons } from './Icons';
import styles from './CoverLetterPanel.module.css';

interface CoverLetterPanelProps {
    resumeText: string;
    jobDescription: string;
    jobTitle: string;
    company: string;
    isPro: boolean;
    onGenerate: (request: CoverLetterRequest) => Promise<CoverLetterResult>;
    onUpgrade: () => void;
}

export const CoverLetterPanel: React.FC<CoverLetterPanelProps> = ({
    resumeText,
    jobDescription,
    jobTitle,
    company,
    onGenerate,
}) => {
    const [tone, setTone] = useState<'professional' | 'friendly' | 'enthusiastic'>('professional');
    const [length, setLength] = useState<'short' | 'medium' | 'long'>('medium');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<CoverLetterResult | null>(null);
    const [error, setError] = useState('');
    const [copied, setCopied] = useState(false);

    const handleGenerate = async () => {
        if (!resumeText || !jobDescription) {
            setError('Upload resume and add job description first');
            return;
        }
        setLoading(true);
        setError('');
        try {
            const letter = await onGenerate({ resumeText, jobDescription, jobTitle, company, tone, length });
            setResult(letter);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to generate');
        } finally {
            setLoading(false);
        }
    };

    const handleCopy = async () => {
        if (result) {
            await navigator.clipboard.writeText(result.content);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div className={styles.headerIcon}><Icons.FileText size={18} /></div>
                <div>
                    <h2>Cover Letter Generator</h2>
                    <p>Create a tailored cover letter</p>
                </div>
            </div>

            {(jobTitle || company) && (
                <div className={styles.jobInfo}>
                    {jobTitle && <span><Icons.Briefcase size={12} /> {jobTitle}</span>}
                    {company && <span>@ {company}</span>}
                </div>
            )}

            <div className={styles.settings}>
                <div className={styles.settingGroup}>
                    <label>Tone</label>
                    <div className={styles.options}>
                        {(['professional', 'friendly', 'enthusiastic'] as const).map((t) => (
                            <button key={t} className={`${styles.optionBtn} ${tone === t ? styles.active : ''}`} onClick={() => setTone(t)}>
                                {t.charAt(0).toUpperCase() + t.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>
                <div className={styles.settingGroup}>
                    <label>Length</label>
                    <div className={styles.options}>
                        {(['short', 'medium', 'long'] as const).map((l) => (
                            <button key={l} className={`${styles.optionBtn} ${length === l ? styles.active : ''}`} onClick={() => setLength(l)}>
                                {l.charAt(0).toUpperCase() + l.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <button className={styles.generateBtn} onClick={handleGenerate} disabled={loading || !resumeText || !jobDescription}>
                {loading ? <><Icons.Loader2 size={16} className={styles.spinner} /> Generating...</> : <><Icons.Sparkles size={16} /> Generate</>}
            </button>

            {error && <div className={styles.error}><Icons.AlertTriangle size={14} /> {error}</div>}

            {result && (
                <div className={styles.result}>
                    <div className={styles.resultHeader}>
                        <span>{result.wordCount} words</span>
                        <button className={styles.copyBtn} onClick={handleCopy}>
                            {copied ? <><Icons.Check size={14} /> Copied</> : <><Icons.Copy size={14} /> Copy</>}
                        </button>
                    </div>
                    <div className={styles.letterContent}>{result.content}</div>
                </div>
            )}
        </div>
    );
};

export default CoverLetterPanel;
