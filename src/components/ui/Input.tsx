import React, { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    leftIcon?: string;
}

export const Input: React.FC<InputProps> = ({
    label,
    error,
    leftIcon,
    className = '',
    id,
    ...props
}) => {
    // Use generated ID if none provided
    const inputId = id || React.useId();

    return (
        <div className="flex flex-col gap-1.5 w-full">
            {label && (
                <label htmlFor={inputId} className="text-sm font-medium text-text-primary-light dark:text-gray-200 ml-1">
                    {label}
                </label>
            )}
            <div className="relative">
                <input
                    id={inputId}
                    className={`
            w-full h-12 rounded-xl bg-white dark:bg-surface-dark 
            border-2 border-gray-200 dark:border-gray-700
            text-text-primary-light dark:text-white 
            placeholder:text-gray-400 dark:placeholder:text-gray-600
            focus:border-primary focus:ring-0 focus:outline-none 
            transition-all duration-200
            disabled:opacity-50 disabled:bg-gray-50 dark:disabled:bg-gray-800
            ${leftIcon ? 'pl-11' : 'px-4'}
            ${error ? 'border-danger' : 'hover:border-gray-300 dark:hover:border-gray-600'}
            ${className}
          `}
                    {...props}
                />
                {leftIcon && (
                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                        <span className="material-symbols-outlined text-[20px]">{leftIcon}</span>
                    </div>
                )}
            </div>
            {error && (
                <span className="text-xs text-danger ml-1">{error}</span>
            )}
        </div>
    );
};
