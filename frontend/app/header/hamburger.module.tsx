import styles from './hamburger.module.css';
import React from 'react';

export default (
    {isOpen}:
    { isOpen: boolean }) =>
    (
    <>
        <div className={`${styles.icon} ${styles.navIcon} ${isOpen && 'open'}`}>
            <span></span>
            <span></span>
            <span></span>
        </div>
    </>
)