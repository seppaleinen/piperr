import styles from './workflow.module.css';
import CardModule from './card.module';
import Button from '../button.module';
import { Agent, Card, Workflow } from '../domains';
import { postData } from '../util';

const WorkflowModule = (
    {
        agent,
        workflow,
        setTitleAction,
        setWorkflowAction,
        setError
    }: {
        agent: Agent,
        workflow: Workflow,
        setTitleAction: (titles: string) => void,
        setWorkflowAction: (workflow: Workflow) => void,
        setError: (error: string | null) => void
    }) => {
    const executeScript = async (index: number) => {
        updateCardOutput(index, '', true)
        const script = workflow.cards[index].script;
        const data = index > 0 ? workflow.cards[index - 1].output : null;
        for (const line of data ? data.trim().split('\n') : ['']) {
            postData('/cmd', {cmd: script.replace('{}', line)}, setError)
                .then((result: string) => {
                    const outputs: string[] = []
                    outputs.push(result);
                    updateCardOutput(index, outputs.join(''), false);
                });
        }
    };


    const addCardAction = () => {
        setWorkflowAction({
            ...workflow,
            cards: [...workflow.cards, new Card()]
        });
    };

    const removeCardAction = (index: number) => {
        const updatedCards = workflow.cards.filter((_, i) => i !== index);

        setWorkflowAction({...workflow, cards: updatedCards});
    };

    const updateCardScript = (index: number, script: string) => {
        const updatedCards = workflow.cards.map((card, i) =>
            i === index ? {...card, script} : card
        );

        setWorkflowAction({...workflow, cards: updatedCards});
    };

    const updateCardOutput = (index: number, output: string, loading: boolean) => {
        const updatedCards = workflow.cards.map((card, i) =>
            i === index ? {...card, output, loading} : card
        );

        setWorkflowAction({...workflow, cards: updatedCards});
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
            {workflow.cards.map((card: Card, index: number) => (
                <CardModule
                    key={index}
                    index={index}
                    agent={agent}
                    card={card}
                    addCardAction={addCardAction}
                    removeCardAction={() => removeCardAction(index)}
                    updateCardScriptAction={updateCardScript}
                    executeScriptAction={() => executeScript(index)}
                />
            ))}
            <Button action={executeAllScripts} text={"Execute all steps"}/>
            <div>
            </div>
        </div>
    );
}

export default WorkflowModule;