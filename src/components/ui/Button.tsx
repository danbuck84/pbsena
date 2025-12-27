import React, { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
    isLoading?: boolean;
    fullWidth?: boolean;
    leftIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
    children,
    variant = 'primary',
    isLoading = false,
    fullWidth = false,
    leftIcon,
    className = '',
    disabled,
    ...props
}) => {
    const baseStyles = "inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-base transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed";

    const variants = {
        primary: "bg-primary text-[#003811] hover:bg-primary-dark shadow-lg shadow-primary/20",
        secondary: "bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100",
        outline: "border-2 border-primary/20 text-primary hover:bg-primary/5 bg-transparent",
        ghost: "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 bg-transparent"
    };

    const widthStyles = fullWidth ? "w-full" : "";

    return (
        <button
            className={`${baseStyles} ${variants[variant]} ${widthStyles} ${className}`}
            disabled={disabled || isLoading}
            {...props}
        >
            {isLoading ? (
                <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
            ) : (
                <>
                    {leftIcon && <span className="material-symbols-outlined">{leftIcon}</span>}
                    {children}
                </>
            )}
        </button>
    );
};
