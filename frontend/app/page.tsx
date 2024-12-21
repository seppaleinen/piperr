"use client";
import styles from './page.module.css';
import React, { useEffect, useState } from 'react';
import WorkflowModule from '@/app/workflow.module';
import Header from '@/app/header';
import Workflow from '@/app/workflow';

export default () => {
    const [workflows, setWorkflows] = useState<Workflow[]>([new Workflow()]);
    const [workflowIndex, setWorkflowIndex] = useState(0);

    useEffect(() => {
        async function fetchWorkflows() {
            const response = await fetch('http://localhost:8000/workflows');
            const result = await response.json();
            setWorkflows(result.map((workflow: any) => new Workflow(workflow.title, workflow.cards)));
        }
        fetchWorkflows().then(() => {});
    }, [])

    const setTitle = (title: string) => {
        if(title.trim().length > 0 && workflows.filter(workflow => workflow.title === title).length === 0) {
            const updatedWorkflows = [...workflows];
            updatedWorkflows[workflowIndex].title = title;
            setWorkflows(updatedWorkflows);
        }
    }

    const chooseWorkflow = (title: string) => {
        workflows
            .map((workflow, index) => {
                if(workflow.title === title) {
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

    const setWorkflowAction = (workflow: Workflow) => {
        const updatedWorkflows = [...workflows];
        updatedWorkflows[workflowIndex] = workflow;
        setWorkflows(updatedWorkflows);
    }

    return (
        <div className={styles.main}>
            <Header workflows={workflows}
                    chooseWorkflowAction={chooseWorkflow}
                    createNewWorkflowAction={createNewWorkflowAction}
                    />
            <WorkflowModule workflow={workflows[workflowIndex]}
                            setTitleAction={setTitle}
                            setWorkflowAction={setWorkflowAction}
            />
        </div>
    );
}
