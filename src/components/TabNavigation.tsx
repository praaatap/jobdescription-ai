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
    { id: 'history', label: 'History', icon: 'History' },
    { id: 'settings', label: 'Settings', icon: 'Settings' },
];

export const TabNavigation: React.FC<TabNavigationProps> = ({
    activeTab,
    onTabChange,
}) => {
    return (
        <nav className={styles.nav}>
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
