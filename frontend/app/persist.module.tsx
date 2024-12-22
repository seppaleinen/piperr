"use client";
import Workflow from '@/app/workflow';
import styles from './persist.module.css';

export default function PersistWorkflows(
    {workflows}:
    { workflows: Workflow[] }
) {
    const persistWorkflows = async () => {
        try {
            console.log(`Persisting workflows: ${JSON.stringify(workflows)}`);
            const response = await fetch('http://localhost:8000/persist', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({workflows}),
            });
            const result = await response.text();
            console.log(`Result: ${result}`)
        } catch (error) {
            console.error(`Error: ${error}`)
        }
    };

    return (
        <div onClick={persistWorkflows} className={styles.icon}>
            {icon}
        </div>
    )
}

const icon = (
    <svg fill="#2b6cb0" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg"
         width="32px" height="32px" viewBox="0 0 488.446 488.446">
        <g>
            <g>
                <g>
                    <path d="M153.029,90.223h182.404c5.427,0,9.873-4.43,9.873-9.869V0H143.137v80.354C143.137,85.793,147.571,90.223,153.029,90.223
				z"/>
                    <path d="M480.817,122.864L377.88,19.494v60.859c0,23.404-19.043,42.447-42.447,42.447H153.029
				c-23.409,0-42.447-19.043-42.447-42.447V0H44.823C20.068,0,0.002,20.07,0.002,44.808v398.831
				c0,24.736,20.066,44.808,44.821,44.808h398.813c24.74,0,44.808-20.068,44.808-44.808V141.325
				C488.444,134.392,485.698,127.758,480.817,122.864z M412.461,385.666c0,14.434-11.703,26.154-26.168,26.154H102.137
				c-14.451,0-26.153-11.722-26.153-26.154V249.303c0-14.43,11.702-26.148,26.153-26.148h284.156
				c14.465,0,26.168,11.72,26.168,26.148V385.666z"/>
                    <path d="M356.497,265.131H131.949c-9.008,0-16.294,7.273-16.294,16.28s7.286,16.28,16.294,16.28h224.549
				c8.988,0,16.277-7.273,16.277-16.28S365.487,265.131,356.497,265.131z"/>
                    <path d="M323.936,330.264H164.508c-8.994,0-16.28,7.273-16.28,16.28c0,8.989,7.286,16.28,16.28,16.28h159.427
				c8.994,0,16.281-7.291,16.281-16.28C340.217,337.537,332.93,330.264,323.936,330.264z"/>
                </g>
            </g>
        </g>
    </svg>
);