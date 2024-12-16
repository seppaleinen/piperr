"use client";
import Card from './card';
import styles from './page.module.css';
import { useState } from 'react';

export default function Home() {
    const [cards, setCards] = useState<{ script: string; output: string | null; loading: boolean }[]>([
        {script: '', output: null, loading: false}
    ]);

    const executeScript = async (index: number) => {
        updateCardLoading(index, true);
        updateCardOutput(index, '')
        const outputs = []
        const script = cards[index].script;
        const data = index > 0 ? cards[index - 1].output : null;
        for (const line of data ? data.trim().split('\n') : ['']) {
            try {
                const response = await fetch('http://localhost:8000/cmd', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({cmd: script.replace('{}', line)}),
                });
                const result = await response.text();
                outputs.push(result)
            } catch (error) {
                outputs.push(`Error: ${error}`)
            }
        }
        updateCardOutput(index, outputs.join(''));
        updateCardLoading(index, false);
    };


    const addCardAction = () => {
        setCards([...cards, {script: '', output: null, loading: false}]);
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

    const updateCardLoading = (index: number, loading: boolean) => {
        const updatedCards = [...cards];
        updatedCards[index].loading = loading;
        setCards(updatedCards);
    };

    const updateCardOutput = (index: number, output: string) => {
        const updatedCards = [...cards];
        updatedCards[index].output = output;
        setCards(updatedCards);
    };

    const executeAllScripts = async () => {
        for (let i = 0; i < cards.length; i++) {
            await executeScript(i);
        }
    }

    return (
        <div className={styles.main}>
            {cards.map((card, index) => (
                <Card
                    key={index}
                    index={index}
                    script={card.script}
                    output={card.output}
                    loading={card.loading}
                    isLastStep={cards.length === index + 1}
                    addCardAction={addCardAction}
                    removeCardAction={() => removeCardAction(index)}
                    updateCardScriptAction={updateCardScript}
                    executeScriptAction={() => executeScript(index)}
                />
            ))}
            <button className="button" onClick={executeAllScripts}>
                Execute all steps
            </button>
        </div>
    );
}
