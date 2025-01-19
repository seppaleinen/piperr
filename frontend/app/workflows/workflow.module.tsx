import styles from './workflow.module.css';
import CardModule from './card.module';
import Button from '@commons/button.module';
import { Agent, Card, Workflow } from '@commons/domains';
import { postData } from '@commons/util';

const WorkflowModule = (
    {
        agent,
        workflow,
        setWorkflowAction,
        setError
    }: {
        agent: Agent,
        workflow: Workflow,
        setWorkflowAction: (workflow: Workflow) => void,
        setError: (error: string | null) => void
    }) => {
    const executeScript = async (index: number) => {
        updateCardOutput(index, '', true)
        const script = workflow.cards[index].script;
        const data = index > 0 ? workflow.cards[index - 1].output : null;
        for (const line of data ? data.trim().split('\n') : ['']) {
            console.log(`Executing script on agent: ${agent.id} ${agent.nickname}`);
            postData('/cmd', {cmd: script.replace('{}', line), agent_id: agent.id}, setError)
                .then((result: string) => {
                    const outputs: string[] = []
                    outputs.push(result);
                    updateCardOutput(index, outputs.join(''), false);
                });
        }
    };

    const updateTitle = (title: string) => {
        setWorkflowAction({...workflow, title: title});
    }

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