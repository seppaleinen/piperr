import styles from './page.module.css';
import { useEffect, useState } from 'react';
import WorkflowModule from './workflows/workflow.module';
import Header from './header/header.module';
import './globals.css';
import { BrowserRouter, Route, Routes } from 'react-router';
import AboutModule from '@/about/about.module';
import SettingsModule from '@/settings/settings.module';
import ErrorModule from '@commons/error.module';
import { getData } from '@commons/util';
import { Agent, Card, Workflow } from '@commons/domains';

const PageModule = () => {
    const [workflowIndex, setWorkflowIndex] = useState(0);
    const [agentId, setAgentId] = useState(0);
    const [agents, setAgents] = useState<Agent[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            const result = await getData('/data', setError);

            console.log("Agents: ", JSON.stringify(result));
            if (Object.keys(result).length > 0 && result.agents?.length > 0) {
                setAgents(result.agents);
                setAgentId(0);
            }
        }

        fetchData().then(() => {
        });
    }, [])


    const chooseWorkflow = (agentId: number, title: string) => {
        setAgents((prevAgents) =>
            prevAgents.map((agent) => {
                if (agent.id === agentId) {
                    console.log("Choosing workflow: ", title);
                    const index = agent.workflows
                        .findIndex(workflow => workflow.title === title);
                    setWorkflowIndex(index);
                    setAgentId(agentId);
                }
                return agent;
            })
        );
    }

    const createNewWorkflowAction = (agentId: number) => {
        setAgents((prevAgents) =>
            prevAgents.map((agent) => {
                if (agent.id === agentId) {
                    const lastWorkflow = agent.workflows[agent.workflows.length - 1];
                    if (lastWorkflow === undefined || lastWorkflow?.title.trim().length > 0) {
                        const updatedWorkflows = [...agent.workflows, new Workflow('Unnamed workflow', [new Card()], agentId)];
                        setWorkflowIndex(updatedWorkflows.length - 1);
                        setAgentId(agentId);
                        return {...agent, workflows: updatedWorkflows};
                    } else {
                        setError("Please enter a title for the current workflow before creating a new one.");
                    }
                }
                return agent;
            })
        );
    }

    const removeWorkflowAction = (agentId: number, title: string) => {
        setAgents((prevAgents) =>
            prevAgents.map((agent) => {
                if (agent.id === agentId) {
                    const updatedWorkflows = agent.workflows.filter(workflow => workflow.title !== title);
                    if (updatedWorkflows.length === 0) {
                        updatedWorkflows.push(new Workflow('Unnamed workflow', [new Card()], agentId));
                    }
                    return {...agent, workflows: updatedWorkflows};
                }
                return agent;
            })
        );
    }

    const setWorkflowAction = (workflow: Workflow) => {
        setAgents((prevAgents) =>
            prevAgents.map((agent) => {
                if (agent.id === agentId) {
                    const updatedWorkflows = agent.workflows.map((w, i) => (i === workflowIndex ? workflow : w));
                    return {...agent, workflows: updatedWorkflows};
                }
                return agent;
            })
        );
    }

    const getCurrentAgent = () => {
        return agents.find(agent => agent.id === agentId) || new Agent(agentId);
    }

    const workflowModule = <WorkflowModule
        setError={setError}
        agent={getCurrentAgent()}
        workflow={agents
            .find(agent => agent.id === agentId)
            ?.workflows[workflowIndex] || new Workflow('Unnamed workflow', [new Card()], agentId)}
        setWorkflowAction={setWorkflowAction}/>;
    return (
        <div className={styles.main}>
            <BrowserRouter>
                <Header agents={agents}
                        setError={setError}
                        chooseWorkflowAction={chooseWorkflow}
                        createNewWorkflowAction={createNewWorkflowAction}
                        removeWorkflowAction={removeWorkflowAction}
                />

                <Routes>
                    <Route index path="/" element={workflowModule}/>
                    <Route path="/about" element={<AboutModule/>}/>
                    <Route path="/settings" element={<SettingsModule
                        agents={agents}
                        setAgents={setAgents}
                        setError={setError}/>}/>
                    <Route path="*" element={workflowModule}/>
                </Routes>

                <ErrorModule setError={setError} errorMessage={error}/>
            </BrowserRouter>
        </div>
    );
}

export default PageModule;