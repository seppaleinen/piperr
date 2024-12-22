"use client";
import styles from '@/app/button.module.css';

export default ({action, text, style}: {
    action: () => void,
    text: string,
    style?: string;
}) => (
    <button onClick={action} className={`${styles.button} ${style}`}>
        {text}
    </button>
)