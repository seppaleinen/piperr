"use client";
import Hamburger from '@/app/hamburger.module';
import { useEffect, useRef, useState } from 'react';
import Workflow from '@/app/workflow';
import styles from './header.module.css';
import PersistWorkflows from '@/app/persist.module';

export default ({workflows, chooseWorkflowAction, createNewWorkflowAction, removeWorkflowAction}: {
    workflows: Workflow[],
    chooseWorkflowAction: (title: string) => void,
    createNewWorkflowAction: () => void,
    removeWorkflowAction: (title: string) => void
}) => {
    const [hamburgerOpen, setHamburgerOpen] = useState(false);
    const wrapperRef = useRef<HTMLDivElement | null>(null);

    const toggleHamburger = () => {
        setHamburgerOpen(!hamburgerOpen);
    }

    const createNewWorkflowAndClose = () => {
        createNewWorkflowAction();
        setHamburgerOpen(false);
    }

    const chooseWorkflowAndClose = (title: string) => {
        chooseWorkflowAction(title);
        setHamburgerOpen(false);
    }

    const useClickOutside = (ref: any, onClickOutside: any) => {
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

    useClickOutside(wrapperRef, () => {
        setHamburgerOpen(false);
    });

    return (
        <div className={"header"} ref={wrapperRef}>
            <div className={"navigation"}>
                <ul>
                    <li onClick={() => createNewWorkflowAndClose()}>Create new workflow</li>
                    <hr/>
                    {workflows
                        .map((workflow, index) =>
                            (
                                <li key={index}
                                    onClick={() => chooseWorkflowAndClose(workflow.title)}>
                                    <div className={"inline"}>{workflow.title}</div>
                                    <div className={"inline close"} onClick={() => removeWorkflowAction(workflow.title)}>X</div>
                                </li>
                            )
                        )
                    }
                </ul>
                <div className={"hamburger"} onClick={toggleHamburger}>
                    <Hamburger isOpen={hamburgerOpen}/>
                </div>
            </div>
            <div className={"title"}>
                PIPERR
            </div>
            <div className={styles.persist}>
                <PersistWorkflows workflows={workflows}/>
            </div>

            <style jsx>{`
                .header {
                    background-color: var(--primary);
                    height: 60px; /* Increased height for better spacing */
                    display: flex;
                    justify-content: center; /* Align title and navigation on ends */
                    align-items: center; /* Vertically center items */
                    box-shadow: rgba(0, 0, 0, 0.35) 0 5px 15px;
                    width: 100%; /* Full width of the screen */
                }

                .title {
                    font-weight: bolder;
                    font-size: 24px; /* Slightly larger text */
                    color: var(--foreground); /* Ensure text is visible */
                    position: absolute; /* Allow absolute centering for PIPERR */
                    left: 50%;
                    transform: translateX(-50%); /* Center the title horizontally */
                }

                .navigation {
                    width: 100%;
                    z-index: 100;
                }

                .navigation ul li {
                    list-style-type: none;
                    font-weight: bolder;
                    font-size: 24px; /* Slightly larger text */
                    color: var(--foreground); /* Ensure text is visible */
                    padding: 8px clamp(24px, 5vw, 80px); /* Add some horizontal padding */
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                }

                .navigation ul li div {
                    list-style-type: none;
                    font-weight: bolder;
                    font-size: 24px; /* Slightly larger text */
                    color: var(--foreground); /* Ensure text is visible */
                }

                .navigation ul li:hover {
                    box-shadow: rgba(0, 0, 0, 0.35) 5px 5px 15px inset;
                }

                .hamburger {
                    display: block;
                    padding: 10px clamp(24px, 5vw, 80px); /* Add some horizontal padding */
                }

                .navigation ul {
                    display: ${hamburgerOpen ? 'inline' : 'none'};
                    background-color: var(--primary);
                    height: 100vh;
                    width: 60vw;
                    margin-top: 55px;
                    position: fixed;
                }
                
                .inline {
                    display: inline;
                }
                
                .close {
                    padding: 0 8px;
                    cursor: pointer;
                    border: 8px;
                }
                
                .close:active {
                    box-shadow: rgba(0, 0, 0, 0.35) 5px 5px 15px inset;
                }

                @media (max-width: 767px) {
                    .navigation ul li:hover {
                        box-shadow: unset;
                    }

                    .navigation ul li:active {
                        box-shadow: rgba(0, 0, 0, 0.35) 5px 5px 15px inset;
                    }
                }
            `}</style>
        </div>
    )
        ;
}
