import styles from './page.module.css';

export default function Home() {
    return (
        <div className={styles.card}>
            <textarea className={styles.script}
                      placeholder={"#!/bin/bash"}>
            </textarea>
            <button className={styles.button}>
                Execute script
            </button>
            <div className={styles.output}>RESULT</div>
        </div>
    );
}
