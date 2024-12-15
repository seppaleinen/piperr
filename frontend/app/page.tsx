"use client";
import Card from './card';
import styles from './page.module.css';
import { useState } from 'react';

export default function Home() {
    const [cards, setCards] = useState<{ script: string; output: string | null }[]>([
        { script: '', output: null }
    ]);

    const addCardAction = () => {
        setCards([...cards, { script: '', output: null }]);
    };

    const removeCardAction = (index: number) => {
        const updatedCards = [...cards];
        updatedCards.splice(index, 1);
        setCards(updatedCards);
    };

    const updateCardScript = (index: number, script: string) => {
        const updatedCards = [...cards];
        updatedCards[index].script = script;
        setCards(updatedCards);
    };

    const updateCardOutput = (index: number, output: string) => {
        const updatedCards = [...cards];
        updatedCards[index].output = output;
        setCards(updatedCards);
    };

    return (
        <div className={styles.main}>
            {cards.map((card, index) => (
                <Card
                    key={index}
                    index={index}
                    script={card.script}
                    output={card.output}
                    data={index > 0 ? cards[index - 1].output : null} // Pass previous card's output
                    addCardAction={addCardAction}
                    isLastStep={cards.length === index + 1}
                    removeCardAction={() => removeCardAction(index)}
                    updateCardScriptAction={updateCardScript}
                    updateCardOutputAction={updateCardOutput}
                />
            ))}
            <button className="button" onClick={() => console.log(cards)}>
                Execute all steps
            </button>
        </div>
    );
}
