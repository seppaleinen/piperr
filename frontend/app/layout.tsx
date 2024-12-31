import React from 'react';
import ReactDOM from 'react-dom/client';
import Page from './workflows/page.module';

const render = () => {
    if (process.env.NODE_ENV === 'development') {
        return (
            <React.StrictMode>
                <Page />
            </React.StrictMode>
        );
    } else {
        return <Page />;
    }
}
ReactDOM.createRoot(document.getElementById('root')!).render(
    render()
);
