import styles from './spinner.module.css';

export const SpinnerModule = ({loading}: {loading: boolean}) => {
    return (
        <div className={styles.spinnerContainer}>
            {loading ? (
                <div/>
            ) : (
                <svg className="spinner" role="alert" aria-live="assertive">
                    <circle cx="30" cy="30" r="20" className="circle"/>
                </svg>
            )}
        </div>
    );
}