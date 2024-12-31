import styles from './card.module.css';
import Button from '../button.module';
import React from 'react';
import { Card } from '../domains';

function getElement(output: string | null) {
    console.log("OUTPUT2:" + output);
    return <></>;
}

export default ({
                    index,
                    card,
                    addCardAction,
                    removeCardAction,
                    updateCardScriptAction,
                    executeScriptAction,
                }: {
    index: number;
    card: Card;
    addCardAction: () => void;
    removeCardAction: () => void;
    updateCardScriptAction: (index: number, script: string) => void;
    executeScriptAction: () => Promise<void>;
}) => (
    <div className={styles.card}>
        <div className={styles.outerScript}>
            <svg height="100%" width="100%" xmlns="http://www.w3.org/2000/svg"
                 className={card.loading ? styles.showLoading : styles.hide}>
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
                value={card.script}
                onChange={(e) => updateCardScriptAction(index, e.target.value)}
                className={`${styles.script} ${card.loading || styles.showBorder}`}
                placeholder="Enter script here..."
            ></textarea>
        </div>
        <div className={styles.buttons}>
            <Button action={addCardAction} text={"Add step"} style={styles.addCard}/>
            <Button action={removeCardAction} text={"Remove step"} style={styles.removeCard}/>
            <Button action={executeScriptAction} text={"Execute step"} style={styles.execute}/>
        </div>
        {getElement(card.output)}
        {card.output && <div className={styles.output}>{card.output}</div>}
    </div>
)
