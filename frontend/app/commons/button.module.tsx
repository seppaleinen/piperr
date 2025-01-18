import styles from './button.module.css';

const ButtonModule = ({action, text, style}: {
    action: () => void,
    text: string,
    style?: string;
}) => (
    <button onClick={action} className={`${styles.button} ${style}`}>
        {text}
    </button>
)

export default ButtonModule;