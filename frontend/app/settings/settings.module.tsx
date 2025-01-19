import React from 'react';
import styles from './settings.module.css';
import ButtonModule from '@commons/button.module';
import { Agent, Settings } from '@commons/domains';
import { postData } from '@commons/util';
import { SpinnerModule } from '@commons/spinner.module';

const SettingsModule = (
    {
        agents,
        setAgents,
        setError
    }:
    {
        agents: Agent[],
        setAgents: (agents: Agent[]) => void,
        setError: (error: string | null) => void
    }) => {
    const [loading, setLoading] = React.useState(false);

    const persistData = async () => {
        await postData('/persist/data', new Settings(agents), setError);
    };

    const doInput = (agent: Agent, field: keyof Agent, text: string, type: string = 'text') => {
        return (
            <div className={styles.inputWrapper}>
                <span>{text}</span>
                <input type={type}
                       value={String(agent[field])}
                       className={styles.input}
                       onChange={(e) => {
                           const updatedAgent = {...agent, [field]: e.target.value};
                           setAgents(agents.map(a => a.id === agent.id ? updatedAgent : a));
                       }}/>
            </div>
        )
    }

    const doCheckbox = (agent: Agent, field: keyof Agent) => {
        return (
            <div className={styles.inputWrapper}>
                <span>main: </span>
                <input type="checkbox"
                       checked={agent.main}
                       className={`${styles.input} ${styles.checkbox}`}
                       onChange={(e) => {
                           const updatedAgent = {...agent, [field]: e.target.checked};
                           setAgents(agents.map(a => a.id === agent.id ? updatedAgent : a));
                       }}/>
            </div>
        )
    }

    return (
        <section className={styles.settings}>
            <h1>Settings</h1>
            <hr/>
            <div className={styles.agents}>
                {agents
                    .sort((a, b) => a.id - b.id)
                    .map(agent => {
                        return (
                            <div className={styles.agent} key={agent.id}>
                                <div className={styles.remove}
                                     onClick={() => {
                                         setAgents(agents.filter(a => a.id !== agent.id))
                                     }}>X
                                </div>
                                <br/>
                                {doInput(agent, 'nickname', 'Server nickname: ')}
                                {doInput(agent, 'ip', 'Agent IP: ')}
                                {doInput(agent, 'os', 'OS: ')}
                                {doInput(agent, 'shell', 'shell: ')}
                                {doInput(agent, 'username', 'username: ')}
                                {doCheckbox(agent, 'main')}
                                {doInput(agent, 'sudo_password', 'Sudo password: ', 'password')}
                            </div>
                        )
                    })}
            </div>
            <ButtonModule action={() => {
                const newAgentId = agents.map(a => a.id)
                    .reduce((a, b) => Math.max(a, b), 0) + 1; // Take the highest ID and add 1 for new ID
                setAgents(agents.concat([new Agent(newAgentId)]));
            }}
                          text={"Add Agent"}
                          style={styles.add}/>
            <ButtonModule action={persistData}
                          text={"Save"}
                          style={styles.submit}/>
            {loading && <SpinnerModule loading={loading}/>}
        </section>
    )
}

export default SettingsModule;