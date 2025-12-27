import React from 'react';

interface NumberBallProps {
    number: number;
    isSelected?: boolean;
    isResult?: boolean;
    isMatched?: boolean; // Highlight for hits
    onClick?: () => void;
    size?: 'sm' | 'md' | 'lg';
}

export const NumberBall: React.FC<NumberBallProps> = ({
    number,
    isSelected = false,
    isResult = false,
    isMatched = false,
    onClick,
    size = 'md'
}) => {
    const formattedNumber = number.toString().padStart(2, '0');

    // Size mappings
    const sizeClasses = {
        sm: "w-8 h-8 text-xs",
        md: "w-10 h-10 sm:w-12 sm:h-12 text-lg",
        lg: "w-14 h-14 text-xl"
    };

    // State styling
    let stateClasses = "bg-gray-100 dark:bg-gray-800 text-text-secondary-light dark:text-text-secondary-dark hover:bg-gray-200 dark:hover:bg-gray-700 border-transparent";

    if (isSelected) {
        stateClasses = "bg-primary text-white shadow-md shadow-primary/30 ring-2 ring-primary border-transparent";
    } else if (isMatched) {
        stateClasses = "bg-green-500 text-white shadow-md shadow-green-500/30 ring-2 ring-green-500 border-transparent";
    } else if (isResult) {
        stateClasses = "bg-white dark:bg-surface-dark border-2 border-gray-200 dark:border-gray-700 text-text-primary-light dark:text-white";
    }

    return (
        <button
            onClick={onClick}
            disabled={!onClick}
            className={`
        relative flex items-center justify-center rounded-full font-bold transition-all duration-200 shrink-0
        ${sizeClasses[size]}
        ${stateClasses}
        ${onClick ? 'cursor-pointer active:scale-90' : 'cursor-default'}
      `}
        >
            {formattedNumber}
        </button>
    );
};
