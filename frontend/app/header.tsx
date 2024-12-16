"use client";
import Hamburger from '@/app/hamburger.module';
import { useState } from 'react';

export default function Header() {
    const [hamburgerOpen, setHamburgerOpen] = useState(false);

    const toggleHamburger = () => {
        setHamburgerOpen(!hamburgerOpen);
    }

    return (
        <div className={"header"}>
            <div className={"title"}>
                PIPERR
            </div>
            <div className={"navigation"}>
                <ul>
                    <li>Home</li>
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

                .navigation ul {
                    flex-wrap: wrap;
                    float: left;
                }

                .navigation ul li {
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
                    display: none;
                }

                @media (max-width: 767px) {
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
