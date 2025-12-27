import React from 'react';
// We'll use Link later when router is fully set up, for now just buttons/anchors as placeholders
// import { Link, useLocation } from 'react-router-dom';

interface BottomNavProps {
    activeTab?: 'home' | 'history' | 'new-game' | 'groups' | 'profile';
    onNavigate?: (tab: 'home' | 'history' | 'new-game' | 'groups' | 'profile') => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
    activeTab = 'home',
    onNavigate
}) => {
    const navItems = [
        { id: 'home', label: 'Início', icon: 'home' },
        { id: 'history', label: 'Jogos', icon: 'receipt_long' },
        { id: 'new-game', label: 'Novo', icon: 'add' }, // Center FAB
        { id: 'groups', label: 'Bolões', icon: 'groups' },
        { id: 'profile', label: 'Perfil', icon: 'person' },
    ] as const;

    return (
        <nav className="fixed bottom-0 z-50 w-full bg-surface-light dark:bg-surface-dark border-t border-gray-200 dark:border-gray-800 pb-safe">
            <div className="flex items-center justify-around h-16 max-w-lg mx-auto px-2">
                {navItems.map((item) => {
                    const isActive = activeTab === item.id;
                    const isNewGame = item.id === 'new-game';

                    if (isNewGame) {
                        return (
                            <div key={item.id} className="relative w-16 h-full flex items-center justify-center -mt-6">
                                <button
                                    onClick={() => onNavigate?.(item.id)}
                                    className="size-14 rounded-full bg-primary text-white shadow-lg shadow-primary/40 hover:bg-primary-dark active:scale-95 transition-all duration-200 flex items-center justify-center border-4 border-surface-light dark:border-surface-dark"
                                >
                                    <span className="material-symbols-outlined text-3xl">add</span>
                                </button>
                            </div>
                        );
                    }

                    return (
                        <button
                            key={item.id}
                            onClick={() => onNavigate?.(item.id)}
                            className={`
                flex flex-col items-center justify-center w-full h-full gap-1 transition-colors
                ${isActive
                                    ? 'text-primary'
                                    : 'text-text-secondary-light dark:text-text-secondary-dark hover:text-primary dark:hover:text-primary'
                                }
              `}
                        >
                            <span className={`material-symbols-outlined text-[26px] ${isActive ? 'fill-1' : ''}`}>
                                {item.icon}
                            </span>
                            <span className="text-[10px] font-medium">
                                {item.label}
                            </span>
                        </button>
                    );
                })}
            </div>
            {/* iOS Home Indicator Spacing */}
            <div className="h-4 w-full bg-surface-light dark:bg-surface-dark"></div>
        </nav>
    );
};
