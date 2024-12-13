"use client";
import styles from './card.module.css';
import { useState } from 'react';

export default function Card({addToCardsAction, isLastStep}: { addToCardsAction: () => void, isLastStep: boolean }) {
    const [script, setScript] = useState('#!/bin/bash');
    const [output, setOutput] = useState('RESULT');

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
                setOutput(data);
            }
        } catch (error) {
            setOutput('Error connecting to backend.' + error);
        }
    };

    const addSteppy = (isLastStep: boolean) => {
        if(isLastStep) {
            return <button onClick={addToCardsAction}
                    className={"button"}>
                Add step
            </button>
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
            <div className={styles.output}>{output}</div>
            {addSteppy(isLastStep)}
        </div>
    );
}
