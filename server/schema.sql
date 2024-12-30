CREATE TABLE IF NOT EXISTS settings
(
    id INTEGER PRIMARY KEY
);
CREATE TABLE IF NOT EXISTS agents
(
    id            INTEGER PRIMARY KEY,
    settings_id   INTEGER NOT NULL REFERENCES settings (id),
    ip            TEXT,
    sudo_password TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS workflows
(
    title TEXT PRIMARY KEY
);
CREATE TABLE IF NOT EXISTS cards
(
    workflow_title TEXT    NOT NULL REFERENCES workflows (title),
    card_index     INTEGER NOT NULL,
    script         TEXT,
    constraint card_pk PRIMARY KEY (workflow_title, card_index)
)
