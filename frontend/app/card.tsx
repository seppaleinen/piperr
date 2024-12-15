"use client";
import styles from './card.module.css';

export default function Card({
                                 index,
                                 script,
                                 output,
                                 data,
                                 addCardAction,
                                 isLastStep,
                                 removeCardAction,
                                 updateCardScriptAction,
                                 updateCardOutputAction
                             }: {
    index: number;
    script: string;
    output: string | null;
    data: string | null;
    addCardAction: () => void;
    isLastStep: boolean;
    removeCardAction: () => void;
    updateCardScriptAction: (index: number, script: string) => void;
    updateCardOutputAction: (index: number, output: string) => void;
}) {
    const executeScript = async () => {
        try {
            const replacedData = data ? script.replace("{}", data) : script;
            const response = await fetch('http://localhost:5000/cmd', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ cmd: script.replace("{}", replacedData) }),
            });
            const result = await response.text();
            updateCardOutputAction(index, result);
        } catch (error) {
            updateCardOutputAction(index, 'Error: ' + error);
        }
    };

    return (
        <div className={styles.card}>
            <textarea
                value={script}
                onChange={(e) => updateCardScriptAction(index, e.target.value)}
                className={styles.script}
                placeholder="Enter script here..."
            ></textarea>
            <button onClick={executeScript} className="button">
                Execute step
            </button>
            {output && <div className={styles.output}>Output: {output}</div>}
            {isLastStep ? (
                <button onClick={addCardAction} className="button">
                    Add step
                </button>
            ) : (
                <button onClick={removeCardAction} className="button">
                    Remove step
                </button>
            )}
        </div>
    );
}
