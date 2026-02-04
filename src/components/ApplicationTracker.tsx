import React, { useState } from 'react';
import { JobHistoryItem } from '../types';
import { Icons } from './Icons';
import styles from './ApplicationTracker.module.css';

interface ApplicationTrackerProps {
    jobs: JobHistoryItem[];
    onStatusUpdate: (jobId: number, status: JobHistoryItem['status']) => void;
    onNotesUpdate: (jobId: number, notes: string) => void;
    onDateUpdate: (jobId: number, field: 'applicationDate' | 'interviewDate', date: number) => void;
    onDelete: (jobId: number) => void;
}

export const ApplicationTracker: React.FC<ApplicationTrackerProps> = ({
    jobs,
    onStatusUpdate,
    onNotesUpdate,
    onDateUpdate,
    onDelete,
}) => {
    const [expandedJobs, setExpandedJobs] = useState<Set<number>>(new Set());

    const toggleExpanded = (jobId: number) => {
        setExpandedJobs(prev => {
            const next = new Set(prev);
            if (next.has(jobId)) {
                next.delete(jobId);
            } else {
                next.add(jobId);
            }
            return next;
        });
    };

    // Calculate metrics
    const totalApplications = jobs.filter(j => j.status !== 'pending').length;
    const interviews = jobs.filter(j => j.status === 'interview' || j.status === 'offer').length;
    const offers = jobs.filter(j => j.status === 'offer').length;
    const responseRate = totalApplications > 0
        ? Math.round((interviews / totalApplications) * 100)
        : 0;
    const avgMatchScore = jobs.length > 0
        ? Math.round(jobs.reduce((sum, j) => sum + j.matchScore, 0) / jobs.length)
        : 0;

    const statuses: JobHistoryItem['status'][] = ['pending', 'applied', 'interview', 'offer', 'rejected'];

    const formatDate = (timestamp?: number) => {
        if (!timestamp) return '';
        return new Date(timestamp).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    return (
        <div className={styles.container}>
            {/* Metrics Dashboard */}
            <div className={styles.metrics}>
                <div className={styles.metricCard}>
                    <div className={styles.metricValue}>{totalApplications}</div>
                    <div className={styles.metricLabel}>Applied</div>
                </div>
                <div className={styles.metricCard}>
                    <div className={styles.metricValue}>{interviews}</div>
                    <div className={styles.metricLabel}>Interviews</div>
                </div>
                <div className={styles.metricCard}>
                    <div className={styles.metricValue}>{offers}</div>
                    <div className={styles.metricLabel}>Offers</div>
                </div>
                <div className={styles.metricCard}>
                    <div className={styles.metricValue}>{responseRate}%</div>
                    <div className={styles.metricLabel}>Response</div>
                </div>
                <div className={styles.metricCard}>
                    <div className={styles.metricValue}>{avgMatchScore}%</div>
                    <div className={styles.metricLabel}>Avg Match</div>
                </div>
            </div>

            {/* Job List */}
            {jobs.length === 0 ? (
                <div className={styles.emptyState}>
                    <div className={styles.emptyIcon}>
                        <Icons.Briefcase size={32} />
                    </div>
                    <h3>No Applications Yet</h3>
                    <p>Start analyzing jobs to track your applications</p>
                </div>
            ) : (
                <div className={styles.jobList}>
                    {jobs.map((job) => {
                        const isExpanded = expandedJobs.has(job.id);
                        return (
                            <div key={job.id} className={styles.jobCard}>
                                <div className={styles.jobHeader}>
                                    <div className={styles.jobInfo}>
                                        <h4>{job.jobTitle}</h4>
                                        <p>
                                            <Icons.Briefcase size={12} />
                                            {job.company}
                                        </p>
                                    </div>
                                    <div className={styles.matchScore}>{job.matchScore}%</div>
                                </div>

                                {/* Status Pipeline */}
                                <div className={styles.statusPipeline}>
                                    {statuses.map((status) => (
                                        <button
                                            key={status}
                                            className={`${styles.statusBtn} ${job.status === status ? styles.active : ''} ${styles[status]}`}
                                            onClick={() => onStatusUpdate(job.id, status)}
                                        >
                                            {status}
                                        </button>
                                    ))}
                                </div>

                                {/* Job Metadata */}
                                <div className={styles.jobMeta}>
                                    <span>
                                        <Icons.Clock size={12} />
                                        Analyzed: {formatDate(job.analyzedAt)}
                                    </span>
                                    {job.applicationDate && (
                                        <span>
                                            <Icons.Calendar size={12} />
                                            Applied: {formatDate(job.applicationDate)}
                                        </span>
                                    )}
                                    {job.interviewDate && (
                                        <span>
                                            <Icons.Calendar size={12} />
                                            Interview: {formatDate(job.interviewDate)}
                                        </span>
                                    )}
                                    {job.resumeId && (
                                        <span>
                                            <Icons.FileText size={12} />
                                            Resume: {job.resumeId}
                                        </span>
                                    )}
                                </div>

                                {/* Expanded Section */}
                                {isExpanded && (
                                    <>
                                        {/* Date Inputs */}
                                        <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
                                            <div style={{ flex: 1 }}>
                                                <label style={{ fontSize: 12, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>
                                                    Application Date
                                                </label>
                                                <input
                                                    type="date"
                                                    className={styles.dateInput}
                                                    value={job.applicationDate ? new Date(job.applicationDate).toISOString().split('T')[0] : ''}
                                                    onChange={(e) => {
                                                        if (e.target.value) {
                                                            onDateUpdate(job.id, 'applicationDate', new Date(e.target.value).getTime());
                                                        }
                                                    }}
                                                />
                                            </div>
                                            <div style={{ flex: 1 }}>
                                                <label style={{ fontSize: 12, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>
                                                    Interview Date
                                                </label>
                                                <input
                                                    type="date"
                                                    className={styles.dateInput}
                                                    value={job.interviewDate ? new Date(job.interviewDate).toISOString().split('T')[0] : ''}
                                                    onChange={(e) => {
                                                        if (e.target.value) {
                                                            onDateUpdate(job.id, 'interviewDate', new Date(e.target.value).getTime());
                                                        }
                                                    }}
                                                />
                                            </div>
                                        </div>

                                        {/* Notes */}
                                        <div className={styles.notes}>
                                            <textarea
                                                className={styles.notesTextarea}
                                                placeholder="Add notes about this application..."
                                                value={job.notes || ''}
                                                onChange={(e) => onNotesUpdate(job.id, e.target.value)}
                                            />
                                        </div>
                                    </>
                                )}

                                {/* Actions */}
                                <div className={styles.jobActions}>
                                    <button
                                        className={styles.actionBtn}
                                        onClick={() => toggleExpanded(job.id)}
                                    >
                                        <Icons.Settings size={14} />
                                        {isExpanded ? 'Hide Details' : 'Show Details'}
                                    </button>
                                    {job.url && (
                                        <button
                                            className={styles.actionBtn}
                                            onClick={() => window.open(job.url, '_blank')}
                                        >
                                            <Icons.ExternalLink size={14} />
                                            View Job
                                        </button>
                                    )}
                                    <button
                                        className={`${styles.actionBtn} ${styles.danger}`}
                                        onClick={() => {
                                            if (confirm(`Delete application for ${job.jobTitle}?`)) {
                                                onDelete(job.id);
                                            }
                                        }}
                                    >
                                        <Icons.X size={14} />
                                        Delete
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};
