import React from 'react';
import { ActiveTab } from '../types';
import { Icons } from './Icons';
import styles from './TabNavigation.module.css';

interface TabNavigationProps {
    activeTab: ActiveTab;
    onTabChange: (tab: ActiveTab) => void;
}

const tabs: { id: ActiveTab; label: string; icon: keyof typeof Icons }[] = [
    { id: 'job', label: 'Analyze', icon: 'Target' },
    { id: 'resumes', label: 'Resumes', icon: 'FileText' },
    { id: 'tracker', label: 'Tracker', icon: 'Briefcase' },
    { id: 'history', label: 'History', icon: 'History' },
    { id: 'settings', label: 'Settings', icon: 'Settings' },
];

export const TabNavigation: React.FC<TabNavigationProps> = ({
    activeTab,
    onTabChange,
}) => {
    const navRef = React.useRef<HTMLDivElement>(null);

    const handleWheel = (e: React.WheelEvent) => {
        // Prevent page scroll if user is scrolling on the nav
        if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
            // Horizontal scroll - let the browser handle it
            return;
        }

        e.preventDefault();
        const currentIndex = tabs.findIndex(t => t.id === activeTab);
        if (e.deltaY > 0) {
            // Scroll down -> Next tab
            if (currentIndex < tabs.length - 1) {
                onTabChange(tabs[currentIndex + 1].id);
            }
        } else if (e.deltaY < 0) {
            // Scroll up -> Previous tab
            if (currentIndex > 0) {
                onTabChange(tabs[currentIndex - 1].id);
            }
        }
    };

    React.useEffect(() => {
        const activeElement = navRef.current?.querySelector(`[aria-selected="true"]`);
        if (activeElement) {
            activeElement.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        }
    }, [activeTab]);

    return (
        <nav
            className={styles.nav}
            onWheel={handleWheel}
            ref={navRef}
        >
            {tabs.map((tab) => {
                const Icon = Icons[tab.icon];
                const isActive = activeTab === tab.id;

                return (
                    <button
                        key={tab.id}
                        className={`${styles.tab} ${isActive ? styles.active : ''}`}
                        onClick={() => onTabChange(tab.id)}
                        aria-selected={isActive}
                        role="tab"
                    >
                        <Icon size={16} className={styles.tabIcon} />
                        <span className={styles.tabLabel}>{tab.label}</span>
                    </button>
                );
            })}
        </nav>
    );
};

export default TabNavigation;
