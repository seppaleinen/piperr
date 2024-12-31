import styles from './hamburger.module.css';
import React from 'react';

export default (
    {isOpen}:
    { isOpen: boolean }) =>
    (
        <>
            <div className={`${styles.navIcon} ${isOpen && styles.open}`}>
                <span></span>
                <span></span>
                <span></span>
            </div>
        </>
    )