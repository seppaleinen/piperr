import React from 'react';
import styles from './settings.module.css';
import ButtonModule from '../button.module';

export default () => {
    const [password, setPassword] = React.useState('');

    const persistSettings = async () => {
        try {
            const response = await fetch('http://localhost:8000/persist/settings', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({'password': password}),
            });
            const result = await response.text();
            console.log(`Result: ${result}`)
        } catch (error) {
            console.error(`Error: ${error}`)
        }
    };

    return (
        <section className={styles.settings}>
            <h1>Settings</h1>
            <hr/>
            <p>sudo password</p>
            <input type={"password"}
                   value={password}
                   className={styles.password}
                   onChange={(e) => setPassword(e.target.value)}/>
            <ButtonModule action={persistSettings}
                          text={"Save"}
                          style={styles.submit}/>
        </section>
    )
}