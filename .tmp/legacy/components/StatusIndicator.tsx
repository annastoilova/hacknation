import React from 'react';
import styles from './StatusIndicator.module.css';

interface StatusIndicatorProps {
    status: 'idle' | 'loading' | 'success' | 'error';
    message?: string;
}

const StatusIndicator: React.FC<StatusIndicatorProps> = ({ status = 'idle', message }) => {
    if (status === 'idle') return null;

    return (
        <div className={`${styles.indicator} ${styles[status]}`}>
            <div className={styles.dot}></div>
            <span className={styles.message}>{message}</span>
        </div>
    );
};

export default StatusIndicator;
