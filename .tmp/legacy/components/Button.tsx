import React from 'react';
import styles from './Button.module.css';

interface ButtonProps {
    children: React.ReactNode;
    variant?: 'primary' | 'secondary' | 'accent';
    onClick?: () => void;
    disabled?: boolean;
    className?: string;
}

const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', onClick, disabled, className = '' }) => {
    return (
        <button
            className={`${styles.btn} ${styles[variant]} ${className}`}
            onClick={onClick}
            disabled={disabled}
        >
            {children}
        </button>
    );
};

export default Button;
