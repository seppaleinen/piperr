"use client";
import styles from './card.module.css';

export default function CardModule({
                                 index,
                                 script,
                                 output,
                                 addCardAction,
                                 isLastStep,
                                 removeCardAction,
                                 updateCardScriptAction,
                                 executeScriptAction,
                                 loading,
                                 title
                             }: {
    index: number;
    script: string;
    output: string | null;
    addCardAction: () => void;
    isLastStep: boolean;
    removeCardAction: () => void;
    updateCardScriptAction: (index: number, script: string) => void;
    executeScriptAction: () => Promise<void>;
    loading: boolean;
    title: string;
}) {
    return (
        <div className={styles.card}>
            <div className={styles.outerScript}>
                <svg height="100%" width="100%" xmlns="http://www.w3.org/2000/svg"
                     className={loading ? styles.showLoading : styles.hide}>
                    <rect
                        rx="8"
                        ry="8"
                        className={styles.line}
                        height="100%"
                        width="100%"
                        strokeLinejoin="round"
                    />
                </svg>
                <textarea
                    value={script}
                    onChange={(e) => updateCardScriptAction(index, e.target.value)}
                    className={`${styles.script} ${loading || styles.showBorder}`}
                    placeholder="Enter script here..."
                ></textarea>
            </div>
            <button onClick={executeScriptAction} className={'button'} disabled={loading}>
                Execute step
            </button>
            {output && <div className={styles.output}>{output}</div>}
            {isLastStep ? (
                <button onClick={addCardAction} className="button">
                    Add step
                </button>
            ) : (
                <button onClick={removeCardAction} className={`${styles.remove} button`}>
                    Remove step
                </button>
            )}
        </div>
    );
}
