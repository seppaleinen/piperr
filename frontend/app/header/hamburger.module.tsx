import styles from './hamburger.module.css';

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