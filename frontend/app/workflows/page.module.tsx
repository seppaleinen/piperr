import styles from './page.module.css';
import React, { useEffect, useState } from 'react';
import WorkflowModule from './workflow.module';
import Header from '../header/header.module';
import Workflow from '../workflow';
import '../globals.css';
import { BrowserRouter, Route, Routes } from 'react-router';
import AboutModule from '../about.module';

export default () => {
    const [workflows, setWorkflows] = useState<Workflow[]>([new Workflow()]);
    const [workflowIndex, setWorkflowIndex] = useState(0);

    useEffect(() => {
        async function fetchWorkflows() {
            const response = await fetch('http://localhost:8000/workflows');
            let result: Workflow[] = await response.json();
            if (result.length === 0) {
                result = [new Workflow()];
            }
            setWorkflows(result.map((workflow: Workflow) => new Workflow(workflow.title, workflow.cards)));
        }

        fetchWorkflows().then(() => {
        });
    }, [])

    const setTitle = (title: string) => {
        if (title.trim().length > 0 && workflows.filter(workflow => workflow.title === title).length === 0) {
            const updatedWorkflows = [...workflows];
            updatedWorkflows[workflowIndex].title = title;
            setWorkflows(updatedWorkflows);
        }
    }

    const chooseWorkflow = (title: string) => {
        workflows
            .map((workflow, index) => {
                console.log("INDEX: " + index + ":" + workflow.title)
                if (workflow.title === title) {
                    console.log("Setting index to: " + index);
                    setWorkflowIndex(index);
                }
            });
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
        const updatedWorkflows = [...workflows];
        updatedWorkflows[workflowIndex] = workflow;
        setWorkflows(updatedWorkflows);
    }

    const workflowModule = <WorkflowModule workflow={workflows[workflowIndex]}
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
                    <Route path="*" element={workflowModule}/>
                </Routes>
            </BrowserRouter>
        </div>
    );
}
