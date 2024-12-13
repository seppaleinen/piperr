"use client";
import Card from './card';
import styles from './page.module.css';
import { useState } from 'react';

export default function Home() {
    const [cards, setCards] = useState<typeof Card[]>([Card]);

    const addToCardsAction = () => {
        setCards([...cards, Card]);
    }

    const isLastStep = (i: number) => cards.length === i + 1;

    return (
        <div className={styles.main}>
            {cards.map((Card, index) => (
                <Card key={index}
                      addToCardsAction={addToCardsAction}
                      isLastStep={isLastStep(index)}/>
            ))}
            <button className={"button"}>
                Execute all steps
            </button>
        </div>
    );
}
