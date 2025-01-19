import Hamburger from './hamburger.module';
import { useEffect, useRef, useState } from 'react';
import { Agent } from '@commons/domains';
import styles from './header.module.css';
import PersistWorkflows from './persist.module';
import { Link, useNavigate } from 'react-router-dom';

const HeaderModule = (
    {
        agents,
        chooseWorkflowAction,
        createNewWorkflowAction,
        removeWorkflowAction,
        setError
    }: {
        agents: Agent[],
        chooseWorkflowAction: (agentId: number, title: string) => void,
        createNewWorkflowAction: (agentId: number) => void,
        removeWorkflowAction: (agentId: number, title: string) => void
        setError: (error: string | null) => void
    }) => {
    const navigate = useNavigate();
    const [hamburgerOpen, setHamburgerOpen] = useState(false);
    const wrapperRef = useRef<HTMLDivElement | null>(null);

    const toggleHamburger = () => {
        setHamburgerOpen(!hamburgerOpen);
    }

    const createNewWorkflowAndClose = (agentId: number) => {
        createNewWorkflowAction(agentId);
        setHamburgerOpen(false);
        navigate('/');
    }

    const chooseWorkflowAndClose = (agentId: number, title: string) => {
        chooseWorkflowAction(agentId, title);
        setHamburgerOpen(false);
        navigate('/');
    }

    const useCloseNavigationOnClickOutside = (ref: any, onClickOutside: any) => {
        useEffect(() => {
            const handleClickOutside = (event: any) => {
                if (ref.current && !ref.current.contains(event.target)) {
                    onClickOutside();
                }
            }

            // Bind
            document.addEventListener("mousedown", handleClickOutside);
            document.addEventListener("keydown", (event) => event.key === 'Escape' && onClickOutside());
            return () => {
                // dispose
                document.removeEventListener("mousedown", handleClickOutside);
                document.removeEventListener("keydown", (event) => event.key === 'Escape' && onClickOutside());
            };
        }, [ref, onClickOutside]);
    }

    useCloseNavigationOnClickOutside(wrapperRef, () => {
        setHamburgerOpen(false);
    });

    return (
        <header className={styles.header} ref={wrapperRef}>
            <div className={`${styles.navigation}`}>
                <ul className={hamburgerOpen ? '' : styles.hide}>
                    <li>
                        <Link to={'/'} onClick={() => setHamburgerOpen(!hamburgerOpen)}>Home</Link>
                    </li>
                    <li>
                        <Link to={'/settings'} onClick={() => setHamburgerOpen(!hamburgerOpen)}>Settings</Link>
                    </li>
                    <li>
                        <Link to={'/about'} onClick={() => setHamburgerOpen(!hamburgerOpen)}>About</Link>
                    </li>
                    <hr/>
                    {agents.map((agent) => {
                        return (
                            <div key={`div-${agent.id}`}>
                                <li key={`agent-${agent.id}`} className={styles.agentName}>
                                    {agent.nickname}
                                </li>
                                <li key={`agent-${agent.id}-new`} className={styles.newWorkFlow} onClick={() => createNewWorkflowAndClose(agent.id)}>
                                    <div>Create new workflow</div>
                                </li>
                                {
                                    agent.workflows
                                        .map((workflow, index) =>
                                            (
                                                <li key={`${agent.id}-${index}`}>
                                                    <div className={`${styles.inline} ${styles.name}`}
                                                         onClick={() => chooseWorkflowAndClose(agent.id, workflow.title)}>{workflow.title}</div>
                                                    <div className={`${styles.inline} ${styles.close}`}
                                                         onClick={() => removeWorkflowAction(agent.id, workflow.title)}>X
                                                    </div>
                                                </li>
                                            )
                                        )
                                }
                                <hr/>
                            </div>
                        )
                    })}

                </ul>
                <div className={styles.hamburger} onClick={toggleHamburger}>
                    <Hamburger isOpen={hamburgerOpen}/>
                </div>
            </div>
            <div className={styles.title}>
                PIPERR
            </div>
            <div>
                <PersistWorkflows setError={setError} agents={agents}/>
            </div>
        </header>
    );
}

export default HeaderModule;