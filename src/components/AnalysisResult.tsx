import React from 'react';
import { AnalysisResult, ExpandedSections } from '../types';
import { Icons } from './Icons';
import styles from './AnalysisResult.module.css';

interface AnalysisResultProps {
    result: AnalysisResult;
    expandedSections: ExpandedSections;
    onToggleSection: (section: keyof ExpandedSections) => void;
    onCopyKeywords: () => void;
    onBack: () => void;
}

const getRecommendationConfig = (recommendation: AnalysisResult['recommendation']) => {
    switch (recommendation) {
        case 'strongly_apply':
            return { icon: Icons.Rocket, text: 'Strong Match', color: '#10b981', bg: 'rgba(16, 185, 129, 0.1)' };
        case 'apply':
            return { icon: Icons.TrendingUp, text: 'Good Match', color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.1)' };
        case 'consider':
            return { icon: Icons.AlertTriangle, text: 'Consider', color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.1)' };
        default:
            return { icon: Icons.X, text: 'Not Recommended', color: '#ef4444', bg: 'rgba(239, 68, 68, 0.1)' };
    }
};

const getScoreColor = (score: number): string => {
    if (score >= 85) return '#10b981';
    if (score >= 70) return '#3b82f6';
    if (score >= 50) return '#f59e0b';
    return '#ef4444';
};

export const AnalysisResultView: React.FC<AnalysisResultProps> = ({ result, expandedSections, onToggleSection, onCopyKeywords, onBack }) => {
    const rec = getRecommendationConfig(result.recommendation);
    const RecIcon = rec.icon;

    return (
        <div className={styles.container}>
            <button className={styles.backBtn} onClick={onBack}>
                <Icons.ArrowLeft size={16} />
                <span>Back</span>
            </button>

            <div className={styles.recommendationBadge} style={{ background: rec.bg, color: rec.color }}>
                <RecIcon size={16} />
                <span>{rec.text}</span>
            </div>

            <div className={styles.scoreContainer}>
                <div className={styles.scoreCircle} style={{ '--score': result.matchScore, '--score-color': getScoreColor(result.matchScore) } as React.CSSProperties}>
                    <div className={styles.scoreInner}>
                        <span className={styles.scoreValue}>{result.matchScore}</span>
                        <span className={styles.scorePercent}>%</span>
                    </div>
                </div>
                <span className={styles.scoreLabel}>Match Score</span>
            </div>

            <div className={styles.summary}><p>{result.summary}</p></div>

            <div className={styles.sections}>
                {result.recommendationReasons?.length > 0 && (
                    <Section title="AI Recommendation" items={result.recommendationReasons} expanded={expandedSections.recommendation} onToggle={() => onToggleSection('recommendation')} variant="primary" icon={Icons.Sparkles} />
                )}
                {result.strengths?.length > 0 && (
                    <Section title="Your Strengths" items={result.strengths} expanded={expandedSections.strengths} onToggle={() => onToggleSection('strengths')} variant="success" icon={Icons.Check} />
                )}
                {result.improvements?.length > 0 && (
                    <Section title="Areas to Improve" items={result.improvements} expanded={expandedSections.improvements} onToggle={() => onToggleSection('improvements')} variant="warning" icon={Icons.TrendingUp} />
                )}
                {result.missingKeywords?.length > 0 && (
                    <Section title="Missing Keywords" items={result.missingKeywords} expanded={expandedSections.keywords} onToggle={() => onToggleSection('keywords')} variant="error" icon={Icons.Target} action={<button className={styles.copyBtn} onClick={onCopyKeywords}><Icons.Copy size={12} /> Copy</button>} />
                )}
                {result.atsWarnings?.length > 0 && (
                    <Section title="ATS Tips" items={result.atsWarnings} expanded={expandedSections.ats} onToggle={() => onToggleSection('ats')} variant="info" icon={Icons.AlertTriangle} />
                )}
                {result.interviewTips && result.interviewTips.length > 0 && (
                    <Section title="Interview Tips" items={result.interviewTips} expanded={expandedSections.interviewTips} onToggle={() => onToggleSection('interviewTips')} variant="primary" icon={Icons.Award} />
                )}
            </div>
        </div>
    );
};

interface SectionProps {
    title: string;
    items: string[];
    expanded: boolean;
    onToggle: () => void;
    variant: 'primary' | 'success' | 'warning' | 'error' | 'info';
    icon: typeof Icons.Check;
    action?: React.ReactNode;
}

const Section: React.FC<SectionProps> = ({ title, items, expanded, onToggle, variant, icon: Icon, action }) => (
    <div className={`${styles.section} ${styles[variant]}`}>
        <button className={styles.sectionHeader} onClick={onToggle}>
            <div className={styles.sectionTitle}>
                <Icon size={14} />
                <span>{title}</span>
                <span className={styles.itemCount}>{items.length}</span>
            </div>
            {expanded ? <Icons.ChevronUp size={14} /> : <Icons.ChevronDown size={14} />}
        </button>
        {expanded && (
            <div className={styles.sectionContent}>
                <ul className={styles.itemList}>{items.map((item, i) => <li key={i} className={styles.item}>{item}</li>)}</ul>
                {action && <div className={styles.sectionAction}>{action}</div>}
            </div>
        )}
    </div>
);

export default AnalysisResultView;
