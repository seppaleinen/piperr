"use client";
import styles from '@/app/button.module.css';

export default ({action, text}: {
    action: () => void;
    text: string;
}) => (
    <button onClick={action} className={`${styles.button}`}>
        {text}
    </button>
)