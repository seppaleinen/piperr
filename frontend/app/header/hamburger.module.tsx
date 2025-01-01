import styles from './hamburger.module.css';

const HamburgerModule = (
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

export default HamburgerModule;