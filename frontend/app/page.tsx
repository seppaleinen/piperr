"use client";
import Card from './card';
import styles from './page.module.css';
import { useState } from 'react';

export default function Home() {
    const [cards, setCards] = useState<typeof Card[]>([Card]);

    const addCardAction = () => {
        setCards([...cards, Card]);
    }

    const isLastStep = (i: number) => cards.length === i + 1;

    const removeCardAction = (index: number) => {
        const newCards = [...cards];
        newCards.splice(index, 1);
        setCards(newCards);
    }

    return (
        <div className={styles.main}>
            {cards.map((Card, index) => (
                <Card key={index}
                      addCardAction={addCardAction}
                      index={index}
                      removeCardAction={removeCardAction}
                      isLastStep={isLastStep(index)}/>
            ))}
            <button className={"button"}>
                Execute all steps
            </button>
        </div>
    );
}
