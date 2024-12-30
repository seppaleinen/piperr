import React, { useEffect } from 'react';
import styles from './settings.module.css';
import ButtonModule from '../button.module';
import { Agent, Settings } from '../domains';
import {postData, getData} from '../util';

export default () => {
    const [settings, setSettings] = React.useState(new Settings());

    useEffect(() => {
        async function fetchSettings() {
            const result = await getData('/settings');
            if (Object.keys(result).length > 0 || result.agents.length > 0) {
                setSettings(result);
            }
        }

        fetchSettings().then(() => {
        });
    }, [])

    const persistSettings = async () => {
        await postData('/persist/settings', settings);
    };

    return (
        <section className={styles.settings}>
            <h1>Settings</h1>
            <hr/>
            <div className={styles.agents}>
                {settings.agents
                    .sort((a, b) => b.id - a.id)
                    .map(agent => {
                        return (
                            <div className={styles.agent} key={agent.id}>
                                <div className={styles.remove}
                                     onClick={() => {
                                         setSettings({
                                                 ...settings,
                                                 agents: settings.agents.filter(a => a.id !== agent.id)
                                             }
                                         )
                                     }}>X
                                </div>
                                <span>Agent IP: </span>
                                <input type={"url"}
                                       value={agent.ip}
                                       onChange={(e) => {
                                           const updatedAgent = agent;
                                           updatedAgent.ip = e.target.value;
                                           setSettings({
                                               ...settings,
                                               agents: settings.agents.map(a => a.id === agent.id ? updatedAgent : a)
                                           });
                                       }}/>
                                <p>sudo password: </p>
                                <input type={"text"}
                                       value={agent.sudo_password}
                                       className={styles.password}
                                       onChange={(e) => {
                                           const updatedAgent = agent;
                                           updatedAgent.sudo_password = e.target.value;
                                           setSettings({
                                               ...settings,
                                               agents: settings.agents.map(a => a.id === agent.id ? updatedAgent : a)
                                           });
                                       }}/>
                            </div>
                        )
                    })}
            </div>
            <ButtonModule action={() => {
                setSettings({
                    ...settings,
                    agents: settings.agents.concat(new Agent())
                });
            }}
                          text={"Add Agent"}
                          style={styles.add}/>
            <ButtonModule action={persistSettings}
                          text={"Save"}
                          style={styles.submit}/>
        </section>
    )
}