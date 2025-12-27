import React from 'react';

interface HeaderProps {
    title: React.ReactNode;
    showBack?: boolean;
    onBack?: () => void;
    actions?: React.ReactNode;
}

export const Header: React.FC<HeaderProps> = ({
    title,
    showBack = false,
    onBack,
    actions
}) => {
    return (
        <header className="sticky top-0 z-50 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-sm border-b border-gray-100 dark:border-gray-800 transition-colors duration-300">
            <div className="flex items-center justify-between p-4 max-w-lg mx-auto w-full h-16">
                <div className="flex items-center gap-2">
                    {showBack && (
                        <button
                            onClick={onBack}
                            className="p-2 -ml-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
                        >
                            <span className="material-symbols-outlined text-text-primary-light dark:text-white">arrow_back</span>
                        </button>
                    )}
                    <div className="text-lg font-bold tracking-tight text-text-primary-light dark:text-text-primary-dark truncate flex items-center gap-2">
                        {title}
                    </div>
                </div>

                {actions && (
                    <div className="flex items-center gap-2">
                        {actions}
                    </div>
                )}
            </div>
        </header>
    );
};
