import React from 'react';
import styles from './about.module.css';

export default () => (
    <section className={styles.about}>
        <h1>About Piperr</h1>
        <p>
            Managing home servers often involves repetitive tasks, from keeping packages up to date to executing complex
            file system commands.
        </p>
        <p>
            This platform simplifies these operations by allowing you to design custom workflows
            for executing Unix scripts.
        </p>
        <p>
            Whether it’s scheduling daily updates <code>sudo apt update -y</code> or running intricate
            manual commands like <code>find ~ -type d -name .git -exec sh -c 'cd &#123;&#125;; git pull;' \;</code>, the tool
            provides
            flexibility and precision for all your needs.
        </p>
        <br/>
        <p>
            A key feature of this system is the ability to chain commands together seamlessly. By using placeholders (&#123;&#125;),
            the output of one step in a workflow can feed directly into the next. This not only saves time but also
            enables the creation of powerful, multi-step processes without the need for complex scripting.
        </p>
        <br/>
        <p>
            For example, you could create a workflow to scan your server for specific directories, update relevant
            files, and log the results, all within a single automated sequence. The system’s intuitive design lets you
            configure these workflows through a simple interface, ensuring even those with minimal scripting experience
            can get started quickly.
        </p>
        <br/>
        <p>
            Whether you’re an enthusiast managing a personal lab or a professional looking to optimize server
            maintenance, this tool provides a robust, user-friendly solution. With support for both scheduled and manual
            tasks, it empowers users to maintain control over their servers while reducing the effort required for
            repetitive tasks.
        </p>
    </section>
)