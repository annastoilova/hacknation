import React from 'react';
import styles from './Input.module.css';

interface InputProps {
    label?: string;
    type?: 'text' | 'textarea' | 'password' | 'email' | 'number';
    placeholder?: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    className?: string;
    rows?: number;
    fullWidth?: boolean;
}

const Input: React.FC<InputProps> = ({
    label,
    type = 'text',
    placeholder,
    value,
    onChange,
    className = '',
    rows,
    fullWidth = false
}) => {
    const isTextarea = type === 'textarea';

    return (
        <div className={`${styles.group} ${fullWidth ? styles.fullWidth : ''} ${className}`}>
            {label && <label className={styles.label}>{label}</label>}
            {isTextarea ? (
                <textarea
                    className={`${styles.input} ${styles.textarea}`}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    rows={rows || 4}
                />
            ) : (
                <input
                    type={type}
                    className={styles.input}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                />
            )}
        </div>
    );
};

export default Input;
