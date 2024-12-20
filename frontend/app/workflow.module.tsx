"use client";
import styles from './workflow.module.css';
import CardModule from './card.module';
import { Workflow } from '@/app/page';

export default function WorkflowModule({workflow, setTitleAction, setWorkflowAction}: {
    workflow: Workflow,
    setTitleAction: (titles: string) => void,
    setWorkflowAction: (workflow: Workflow) => void
}) {

    const executeScript = async (index: number) => {
        updateCardLoading(index, true);
        updateCardOutput(index, '')
        const outputs = []
        const script = workflow.cards[index].script;
        const data = index > 0 ? workflow.cards[index - 1].output : null;
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
        setWorkflowAction(workflow);
    };


    const addCardAction = () => {
        workflow.cards = [...workflow.cards, {script: '', output: null, loading: false}];
        setWorkflowAction(workflow);
    };

    const removeCardAction = (index: number) => {
        const updatedCards = [...workflow.cards];
        updatedCards.splice(index, 1);
        workflow.cards = updatedCards;
        setWorkflowAction(workflow);
    };

    const updateCardScript = (index: number, script: string) => {
        const updatedCards = [...workflow.cards];
        updatedCards[index].script = script;
        workflow.cards = updatedCards;
        setWorkflowAction(workflow);

    };

    const updateCardLoading = (index: number, loading: boolean) => {
        const updatedCards = [...workflow.cards];
        updatedCards[index].loading = loading;
        workflow.cards = updatedCards;
        setWorkflowAction(workflow);
    };

    const updateCardOutput = (index: number, output: string) => {
        const updatedCards = [...workflow.cards];
        updatedCards[index].output = output;
        workflow.cards = updatedCards;
        setWorkflowAction(workflow);
    };

    const updateTitle = (title: string) => {
        setTitleAction(title);
        setWorkflowAction(workflow);
    };

    const executeAllScripts = async () => {
        for (let i = 0; i < workflow.cards.length; i++) {
            await executeScript(i);
        }
    }

    return (
        <div className={styles.main}>
            <input value={workflow.title}
                   placeholder={"Name your workflow"}
                   onChange={(e) => updateTitle(e.target.value)}
                   className={styles.title}/>
            {workflow.cards.map((card, index) => (
                <CardModule
                    key={index}
                    index={index}
                    script={card.script}
                    output={card.output}
                    loading={card.loading}
                    title={workflow.title}
                    isLastStep={workflow.cards.length === index + 1}
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
