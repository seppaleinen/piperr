"use client";
import styles from './card.module.css';
import { useState } from 'react';

export default function Card({addCardAction, isLastStep, index, removeCardAction}: {
    addCardAction: () => void,
    isLastStep: boolean,
    index: number,
    removeCardAction: (index: number) => void
}) {
    const [script, setScript] = useState<string>();
    const [output, setOutput] = useState<string>();

    const executeScript = async () => {
        try {
            const data = JSON.stringify({cmd: script});

            const response = await fetch('http://localhost:5000/cmd', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: data,
            });

            if (!response.ok) {
                const errorData = await response.text();
                setOutput(errorData || 'Error executing script.');
            } else {
                const data = await response.text();
                console.log(data);
                setOutput(data);
            }
        } catch (error) {
            setOutput('Error connecting to backend.' + error);
        }
    };

    const addSteppy = (isLastStep: boolean) => {
        if (isLastStep) {
            return <button onClick={addCardAction}
                           className={"button"}>
                Add step
            </button>
        } else {
            return <button onClick={() => {removeCardAction(index);}}
                           className={"button"}>
                Remove step
            </button>
        }
    }

    const conditionalOutput = () => {
        if (output) {
            return <div className={styles.output}>{output}</div>
        }
    }
    return (
        <div className={styles.card}>
            <textarea value={script}
                      onChange={e => setScript(e.target.value)}
                      className={styles.script}
                      placeholder={"#!/bin/bash"}>
            </textarea>
            <button
                onClick={executeScript}
                className={"button"}>
                Execute step
            </button>
            {conditionalOutput()}
            {addSteppy(isLastStep)}
        </div>
    );
}
