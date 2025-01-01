import React, { useEffect } from 'react';
import styles from './settings.module.css';
import ButtonModule from '../button.module';
import { Agent, Settings } from '../domains';
import { getData, postData } from '../util';

const SettingsModule = () => {
    const [settings, setSettings] = React.useState(new Settings());

    useEffect(() => {
        async function fetchSettings() {
            return await getData('/settings');
        }

        fetchSettings()
            .then(result => {
                if (Object.keys(result).length > 0 && result.agents.length > 0) {
                    setSettings(result);
                }
            });
    }, [])

    const persistSettings = async () => {
        await postData('/persist/settings', settings);
    };

    const doStuff = (agent: Agent, field: keyof Agent, text: string, type: string = 'text') => {
        return (
            <div>
                <span>{text}</span>
                <input type={type}
                       value={String(agent[field])}
                       className={styles.input}
                       onChange={(e) => {
                           const updatedAgent = {...agent, [field]: e.target.value};
                           setSettings({
                               ...settings,
                               agents: settings.agents.map(a => a.id === agent.id ? updatedAgent : a)
                           });
                       }}/>
            </div>
        )
    }

    return (
        <section className={styles.settings}>
            <h1>Settings</h1>
            <hr/>
            <div className={styles.agents}>
                {settings.agents
                    .sort((a, b) => a.id - b.id)
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
                                <br/>
                                {doStuff(agent, 'nickname', 'Server nickname: ')}
                                {doStuff(agent, 'ip', 'Agent IP: ')}
                                <div>OS: {agent.os}</div>
                                <div>SHELL: {agent.shell}</div>
                                <div>username: {agent.username}</div>
                                <div>main: {agent.main ? 'Yes' : 'No'}</div>
                                {doStuff(agent, 'sudo_password', 'Sudo password: ', 'text')}
                            </div>
                        )
                    })}
            </div>
            <ButtonModule action={() => {
                setSettings({
                    ...settings,
                    agents: settings.agents.concat(new Agent(settings.agents.length))
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

export default SettingsModule;