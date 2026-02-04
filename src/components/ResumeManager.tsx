import React, { useState } from 'react';
import { Resume } from '../types';
import { Icons } from './Icons';
import styles from './ResumeManager.module.css';

interface ResumeManagerProps {
    resumes: Resume[];
    onResumeSelect: (resumeId: string) => void;
    onResumeDelete: (resumeId: string) => void;
    onResumeRename: (resumeId: string, newName: string) => void;
    onResumeUpload: (file: File, name: string) => void;
}

export const ResumeManager: React.FC<ResumeManagerProps> = ({
    resumes,
    onResumeSelect,
    onResumeDelete,
    onResumeRename,
    onResumeUpload,
}) => {
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [showRenameModal, setShowRenameModal] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [resumeName, setResumeName] = useState('');
    const [renameResumeId, setRenameResumeId] = useState('');

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && file.type === 'application/pdf') {
            setSelectedFile(file);
            setResumeName(file.name.replace('.pdf', ''));
        }
    };

    const handleUpload = () => {
        if (selectedFile && resumeName.trim()) {
            onResumeUpload(selectedFile, resumeName.trim());
            setShowUploadModal(false);
            setSelectedFile(null);
            setResumeName('');
        }
    };

    const handleRename = () => {
        if (resumeName.trim() && renameResumeId) {
            onResumeRename(renameResumeId, resumeName.trim());
            setShowRenameModal(false);
            setResumeName('');
            setRenameResumeId('');
        }
    };

    const openRenameModal = (resume: Resume) => {
        setRenameResumeId(resume.id);
        setResumeName(resume.name);
        setShowRenameModal(true);
    };

    const formatDate = (timestamp: number) => {
        return new Date(timestamp).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const formatFileSize = (text: string) => {
        const bytes = new Blob([text]).size;
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    };

    return (
        <div className={styles.container}>
            {resumes.length === 0 ? (
                <div className={styles.emptyState}>
                    <div className={styles.emptyIcon}>
                        <Icons.FileText size={32} />
                    </div>
                    <h3>No Resumes</h3>
                    <p>Upload your first resume to get started</p>
                </div>
            ) : (
                <div className={styles.resumeList}>
                    {resumes.map((resume) => (
                        <div
                            key={resume.id}
                            className={`${styles.resumeItem} ${resume.isActive ? styles.active : ''}`}
                        >
                            <div className={styles.resumeIcon}>
                                <Icons.FileText size={20} />
                            </div>
                            <div className={styles.resumeInfo}>
                                <div className={styles.resumeName}>{resume.name}</div>
                                <div className={styles.resumeMeta}>
                                    <span>
                                        <Icons.Clock size={10} />
                                        {formatDate(resume.uploadedAt)}
                                    </span>
                                    <span>
                                        <Icons.FileText size={10} />
                                        {formatFileSize(resume.text)}
                                    </span>
                                </div>
                            </div>
                            {resume.isActive && (
                                <div className={styles.activeBadge}>Active</div>
                            )}
                            <div className={styles.resumeActions}>
                                {!resume.isActive && (
                                    <button
                                        className={`${styles.iconBtn} ${styles.success}`}
                                        onClick={() => onResumeSelect(resume.id)}
                                        title="Set as active"
                                    >
                                        <Icons.Check size={16} />
                                    </button>
                                )}
                                <button
                                    className={styles.iconBtn}
                                    onClick={() => openRenameModal(resume)}
                                    title="Rename"
                                >
                                    <Icons.Settings size={16} />
                                </button>
                                <button
                                    className={`${styles.iconBtn} ${styles.danger}`}
                                    onClick={() => {
                                        if (confirm(`Delete "${resume.name}"?`)) {
                                            onResumeDelete(resume.id);
                                        }
                                    }}
                                    title="Delete"
                                >
                                    <Icons.X size={16} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <button className={styles.uploadBtn} onClick={() => setShowUploadModal(true)}>
                <Icons.Upload size={16} />
                Upload New Resume
            </button>

            {/* Upload Modal */}
            {showUploadModal && (
                <div className={styles.modal} onClick={() => setShowUploadModal(false)}>
                    <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <Icons.Upload size={20} />
                            <h3>Upload Resume</h3>
                        </div>
                        <input
                            type="file"
                            accept="application/pdf"
                            onChange={handleFileSelect}
                            style={{ marginBottom: 12 }}
                        />
                        {selectedFile && (
                            <input
                                type="text"
                                className={styles.input}
                                placeholder="Resume name (e.g., Software Engineer Resume)"
                                value={resumeName}
                                onChange={(e) => setResumeName(e.target.value)}
                            />
                        )}
                        <div className={styles.modalActions}>
                            <button
                                className={styles.cancelBtn}
                                onClick={() => {
                                    setShowUploadModal(false);
                                    setSelectedFile(null);
                                    setResumeName('');
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                className={styles.saveBtn}
                                onClick={handleUpload}
                                disabled={!selectedFile || !resumeName.trim()}
                            >
                                Upload
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Rename Modal */}
            {showRenameModal && (
                <div className={styles.modal} onClick={() => setShowRenameModal(false)}>
                    <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <Icons.Settings size={20} />
                            <h3>Rename Resume</h3>
                        </div>
                        <input
                            type="text"
                            className={styles.input}
                            placeholder="New resume name"
                            value={resumeName}
                            onChange={(e) => setResumeName(e.target.value)}
                            autoFocus
                        />
                        <div className={styles.modalActions}>
                            <button
                                className={styles.cancelBtn}
                                onClick={() => {
                                    setShowRenameModal(false);
                                    setResumeName('');
                                    setRenameResumeId('');
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                className={styles.saveBtn}
                                onClick={handleRename}
                                disabled={!resumeName.trim()}
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
