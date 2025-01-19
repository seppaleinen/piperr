CREATE TABLE IF NOT EXISTS settings
(
    id INTEGER PRIMARY KEY
);
CREATE TABLE IF NOT EXISTS agents
(
    id            INTEGER PRIMARY KEY,
    settings_id   INTEGER NOT NULL REFERENCES settings (id),
    main          BOOLEAN NOT NULL DEFAULT 0,
    sudo_password TEXT, -- Optional sudo password of agent
    nickname      TEXT, -- Optional nickname of agent
    ip            TEXT, -- Optional IP of agent
    os            TEXT, -- Optional OS of agent
    shell         TEXT, -- Optional shell of agent
    username      TEXT  -- Optional username of agent
);
CREATE TABLE IF NOT EXISTS workflows
(
    title TEXT PRIMARY KEY,
    agent_id INTEGER NOT NULL REFERENCES agents (id)
);
CREATE TABLE IF NOT EXISTS cards
(
    workflow_title TEXT    NOT NULL REFERENCES workflows (title),
    card_index     INTEGER NOT NULL,
    script         TEXT,
    constraint card_pk PRIMARY KEY (workflow_title, card_index)
)
