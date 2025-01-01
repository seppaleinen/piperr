import styles from './page.module.css';
import { useEffect, useState } from 'react';
import WorkflowModule from './workflow.module';
import Header from '../header/header.module';
import { Agent, Settings, Workflow } from '../domains';
import '../globals.css';
import { BrowserRouter, Route, Routes } from 'react-router';
import AboutModule from '../about.module';
import SettingsModule from '../settings/settings.module';
import { getData } from '../util';

const PageModule = () => {
    const [workflows, setWorkflows] = useState<Workflow[]>([new Workflow()]);
    const [workflowIndex, setWorkflowIndex] = useState(0);
    const [agent, setAgent] = useState(new Agent());

    useEffect(() => {
        async function fetchWorkflows() {
            getData(`/workflows/${agent.id}`)
                .then((result: Workflow[]) => {
                    if (result.length === 0) {
                        result = [new Workflow()];
                    }
                    setWorkflows(result.map((workflow: Workflow) => new Workflow(workflow.title, workflow.cards)));
                });
        }

        async function fetchSettings() {
            getData('/settings')
                .then((result: Settings) => {
                    if (Object.keys(result).length > 0 && result.agents.length > 0) {
                        setAgent(result.agents.filter(agent => agent.id === 0)[0]);
                    }
                });
        }

        fetchWorkflows()
            .then(() => {
            });
        fetchSettings()
            .then(() => {});
    }, [agent.id])

    const setTitle = (title: string) => {
        if (title.trim().length > 0 && workflows.filter(workflow => workflow.title === title).length === 0) {
            setWorkflows((prevWorkflows) =>
                prevWorkflows.map((workflow, index) =>
                    index === workflowIndex ? { ...workflow, title } : workflow
                )
            );        }
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
            alert("Please enter a title for the current workflow before creating a new one.");
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

    const workflowModule = <WorkflowModule agent={agent}
                                           workflow={workflows[workflowIndex]}
                                           setTitleAction={setTitle}
                                           setWorkflowAction={setWorkflowAction}/>;
    return (
        <div className={styles.main}>
            <BrowserRouter>
                <Header workflows={workflows}
                        chooseWorkflowAction={chooseWorkflow}
                        createNewWorkflowAction={createNewWorkflowAction}
                        removeWorkflowAction={removeWorkflowAction}
                />

                <Routes>
                    <Route index path="/" element={workflowModule}/>
                    <Route path="/about" element={<AboutModule/>}/>
                    <Route path="/settings" element={<SettingsModule/>}/>
                    <Route path="*" element={workflowModule}/>
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default PageModule;