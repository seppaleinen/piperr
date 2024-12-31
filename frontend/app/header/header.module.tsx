import Hamburger from './hamburger.module';
import React, { useEffect, useRef, useState } from 'react';
import { Workflow } from '../domains';
import styles from './header.module.css';
import PersistWorkflows from './persist.module';
import { Link, useNavigate } from 'react-router-dom';

export default ({workflows, chooseWorkflowAction, createNewWorkflowAction, removeWorkflowAction}: {
    workflows: Workflow[],
    chooseWorkflowAction: (title: string) => void,
    createNewWorkflowAction: () => void,
    removeWorkflowAction: (title: string) => void
}) => {
    const navigate = useNavigate();
    const [hamburgerOpen, setHamburgerOpen] = useState(false);
    const wrapperRef = useRef<HTMLDivElement | null>(null);

    const toggleHamburger = () => {
        setHamburgerOpen(!hamburgerOpen);
    }

    const createNewWorkflowAndClose = () => {
        createNewWorkflowAction();
        setHamburgerOpen(false);
        navigate('/');
    }

    const chooseWorkflowAndClose = (title: string) => {
        chooseWorkflowAction(title);
        setHamburgerOpen(false);
        navigate('/');
    }

    const closeNavigationOnClickOutside = (ref: any, onClickOutside: any) => {
        useEffect(() => {
            /**
             * Invoke Function onClick outside of element
             */
            function handleClickOutside(event: any) {
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

    closeNavigationOnClickOutside(wrapperRef, () => {
        setHamburgerOpen(false);
    });

    return (
        <header className={styles.header} ref={wrapperRef}>
            <nav className={`${styles.navigation}`}>
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
                    <li onClick={() => createNewWorkflowAndClose()}>
                        <div>Create new workflow</div>
                    </li>
                    {workflows
                        .map((workflow, index) =>
                            (
                                <li key={index}>
                                    <div className={`${styles.inline} ${styles.name}`}
                                         onClick={() => chooseWorkflowAndClose(workflow.title)}>{workflow.title}</div>
                                    <div className={`${styles.inline} ${styles.close}`}
                                         onClick={() => removeWorkflowAction(workflow.title)}>X
                                    </div>
                                </li>
                            )
                        )
                    }
                </ul>
                <div className={styles.hamburger} onClick={toggleHamburger}>
                    <Hamburger isOpen={hamburgerOpen}/>
                </div>
            </nav>
            <div className={styles.title}>
                PIPERR
            </div>
            <div className={styles.persist}>
                <PersistWorkflows workflows={workflows}/>
            </div>
        </header>
    );
}
