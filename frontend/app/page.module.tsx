import styles from './page.module.css';
import { useEffect, useState } from 'react';
import WorkflowModule from './workflows/workflow.module';
import Header from './header/header.module';
import { Agent, Settings, Workflow } from './domains';
import './globals.css';
import { BrowserRouter, Route, Routes } from 'react-router';
import AboutModule from './about/about.module';
import ErrorModule from './error.module';
import SettingsModule from './settings/settings.module';
import { getData } from './util';

const PageModule = () => {
    const [workflows, setWorkflows] = useState<Workflow[]>([new Workflow()]);
    const [workflowIndex, setWorkflowIndex] = useState(0);
    const [agentId, setAgentId] = useState(0);
    const [agents, setAgents] = useState<Agent[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchWorkflows = async () => {
            getData(`/workflows/${agentId}`, setError)
                .then((result: Workflow[]) => {
                    if (result.length === 0) {
                        result = [new Workflow()];
                    }
                    setWorkflows(result.map((workflow: Workflow) => new Workflow(workflow.title, workflow.cards)));
                });
        };

        const fetchSettings = async () => {
            getData('/settings', setError)
                .then((result: Settings) => {
                    if (Object.keys(result).length > 0 && result.agents.length > 0) {
                        setAgents(result.agents);
                        setAgentId(0);
                    }
                });
        };

        Promise.all([fetchWorkflows(), fetchSettings()]).then(() => {
        });
    }, [])

    const setTitle = (title: string) => {
        if (title.trim().length > 0 && workflows.filter(workflow => workflow.title === title).length === 0) {
            setWorkflows((prevWorkflows) =>
                prevWorkflows.map((workflow, index) =>
                    index === workflowIndex ? {...workflow, title} : workflow
                )
            );
        }
    }

    const chooseWorkflow = (title: string) => {
        const index = workflows.findIndex(workflow => workflow.title === title);
        setWorkflowIndex(index);
    }

    const createNewWorkflowAction = () => {
        if (workflows[workflows.length - 1].title.trim().length > 0) {
            const index = workflows.push(new Workflow());
            setWorkflowIndex(index - 1);
        } else {
            setError("Please enter a title for the current workflow before creating a new one.");
        }
    }

    const removeWorkflowAction = (title: string) => {
        // If the current workflow is removed, set the current workflow to the first one
        if (title === workflows[workflowIndex].title) {
            chooseWorkflow(workflows[0].title);
        }

        const updatedWorkflows = workflows.filter(workflow => workflow.title !== title);
        // If all workflows are removed, add a new one
        if (updatedWorkflows.length === 0) {
            updatedWorkflows.push(new Workflow());
        }
        setWorkflows(updatedWorkflows);
    }

    const setWorkflowAction = (workflow: Workflow) => {
        setWorkflows((prevWorkflows) =>
            prevWorkflows.map((w, i) => (i === workflowIndex ? workflow : w))
        );
    }

    const getCurrentAgent = () => {
        return agents.find(agent => agent.id === agentId) || new Agent();
    }

    const workflowModule = <WorkflowModule
        setError={setError}
        agent={getCurrentAgent()}
        workflow={workflows[workflowIndex]}
        setTitleAction={setTitle}
        setWorkflowAction={setWorkflowAction}/>;
    return (
        <div className={styles.main}>
            <BrowserRouter>
                <Header agents={agents}
                        setError={setError}
                        workflows={workflows}
                        chooseWorkflowAction={chooseWorkflow}
                        createNewWorkflowAction={createNewWorkflowAction}
                        removeWorkflowAction={removeWorkflowAction}
                />

                <Routes>
                    <Route index path="/" element={workflowModule}/>
                    <Route path="/about" element={<AboutModule/>}/>
                    <Route path="/settings" element={<SettingsModule setError={setError}/>}/>
                    <Route path="*" element={workflowModule}/>
                </Routes>

                <ErrorModule setError={setError} errorMessage={error}/>
            </BrowserRouter>
        </div>
    );
}

export default PageModule;