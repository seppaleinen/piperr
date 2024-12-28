import styles from './card.module.css';
import Button from './button.module';

export default ({
                    index,
                    script,
                    output,
                    addCardAction,
                    removeCardAction,
                    updateCardScriptAction,
                    executeScriptAction,
                    loading,
                }: {
    index: number;
    script: string;
    output: string | null;
    addCardAction: () => void;
    removeCardAction: () => void;
    updateCardScriptAction: (index: number, script: string) => void;
    executeScriptAction: () => Promise<void>;
    loading: boolean;
}) => (
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
        <Button action={executeScriptAction} text={"Execute step"} style={styles.execute}/>
        <Button action={addCardAction} text={"Add step"} style={styles.addCard}/>
        <Button action={removeCardAction} text={"Remove step"} style={styles.removeCard}/>
        {output && <div className={styles.output}>{output}</div>}
    </div>
)
