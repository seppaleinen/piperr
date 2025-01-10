import styles from './error.module.css';

const ErrorModule = (
    {errorMessage,
    setError}:
    {
        errorMessage: string | null,
        setError: (error: string | null) => void
    }) => {
    return (
        <div className={`${styles.error} ${errorMessage ? styles.show : ''}`}>
            <div className={styles.close} onClick={() => setError(null)}>X</div>
            <h1>Error</h1>
            <p>{errorMessage}</p>
        </div>
    )
};

export default ErrorModule;