import React from 'react';
import { Theme } from '../types';
import { Icons } from './Icons';
import styles from './Header.module.css';

interface HeaderProps {
    theme: Theme;
    onThemeToggle: () => void;
    resumeUploaded: boolean;
    resumeFileName: string;
    onUpdateResume: () => void;
    onClearResume: () => void;
}

export const Header: React.FC<HeaderProps> = ({
    theme,
    onThemeToggle,
    resumeUploaded,
    resumeFileName,
    onUpdateResume,
    onClearResume
}) => {
    return (
        <header className={styles.header}>
            <div className={styles.headerContent}>
                <div className={styles.brand}>
                    <div className={styles.logo}>
                        <Icons.Target size={20} />
                    </div>
                    <div className={styles.brandText}>
                        <h1>JobFit AI</h1>
                        <p>Smart Career Intelligence</p>
                    </div>
                </div>

                <div className={styles.headerActions}>
                    <button
                        className={styles.themeToggle}
                        onClick={onThemeToggle}
                        aria-label="Toggle theme"
                    >
                        {theme === 'dark' ? <Icons.Sun size={16} /> : <Icons.Moon size={16} />}
                    </button>
                </div>
            </div>

            {resumeUploaded && (
                <div className={styles.resumeBar}>
                    <div className={styles.resumeInfo}>
                        <div className={styles.resumeIcon}>
                            <Icons.FileText size={14} />
                        </div>
                        <div className={styles.resumeDetails}>
                            <span className={styles.fileName}>{resumeFileName}</span>
                            <span className={styles.fileLabel}>Active</span>
                        </div>
                    </div>
                    <div className={styles.resumeActions}>
                        <button className={styles.actionBtn} onClick={onUpdateResume}>
                            Update
                        </button>
                        <button className={styles.actionBtn} onClick={onClearResume}>
                            Remove
                        </button>
                    </div>
                </div>
            )}
        </header>
    );
};

export default Header;
