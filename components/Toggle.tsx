import React from 'react';
import styles from './Toggle.module.css';

interface ToggleOption {
    value: string;
    label: string;
    icon?: React.ReactNode;
}

interface ToggleProps {
    options: ToggleOption[];
    value: string;
    onChange: (value: string) => void;
}

const Toggle: React.FC<ToggleProps> = ({ options, value, onChange }) => {
    return (
        <div className={styles.container}>
            {options.map((option) => (
                <button
                    key={option.value}
                    className={`${styles.option} ${value === option.value ? styles.active : ''}`}
                    onClick={() => onChange(option.value)}
                >
                    {option.icon && <span className={styles.icon}>{option.icon}</span>}
                    {option.label}
                </button>
            ))}
        </div>
    );
};

export default Toggle;
