"use client";
import Hamburger from '@/app/hamburger.module';
import { useEffect, useRef, useState } from 'react';
import Workflow from '@/app/workflow';

export default function Header({workflows, chooseWorkflowAction, createNewWorkflowAction}: {
    workflows: Workflow[],
    chooseWorkflowAction: (title: string) => void,
    createNewWorkflowAction: () => void
}) {
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
            <div className={"title"}>
                PIPERR
            </div>
            <div className={"navigation"}>
                <ul>
                    <li onClick={() => createNewWorkflowAndClose()}>New Workflow</li>
                    <hr/>
                    {workflows
                        .map((workflow, index) =>
                            (
                                <li key={index}
                                    onClick={() => chooseWorkflowAndClose(workflow.title)}>{workflow.title}</li>
                            )
                        )
                    }
                </ul>
                <div className={"hamburger"} onClick={toggleHamburger}>
                    <Hamburger isOpen={hamburgerOpen}/>
                </div>
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
                    padding: 10px clamp(24px, 5vw, 80px); /* Add some horizontal padding */
                }

                .navigation ul div {
                    list-style-type: none;
                    font-weight: bolder;
                    font-size: 24px; /* Slightly larger text */
                    color: var(--foreground); /* Ensure text is visible */
                    padding: 10px clamp(24px, 5vw, 80px); /* Add some horizontal padding */
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
