import styles from './card.module.css';
import Button from '../button.module';
import { Agent, Card } from '../domains';

const CardModule = ({
                    index,
                    card,
                    agent,
                    addCardAction,
                    removeCardAction,
                    updateCardScriptAction,
                    executeScriptAction,
                }: {
    index: number;
    card: Card;
    agent: Agent;
    addCardAction: () => void;
    removeCardAction: () => void;
    updateCardScriptAction: (index: number, script: string) => void;
    executeScriptAction: () => Promise<void>;
}) => (
    <div className={styles.card}>
        <div className={styles.outerScript}>
            <div className={styles.tags}>
                <div>{agent.shell}</div>
                <div>{agent.os}</div>
            </div>
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
        {card.output && <div className={styles.output}>{card.output}</div>}
    </div>
)

export default CardModule;