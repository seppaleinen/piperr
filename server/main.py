import json
import sqlite3

import requests
from asgiref.wsgi import WsgiToAsgi
from flask import Flask, request, jsonify, g, current_app
from flask_cors import CORS

from common import execute_command, get_ip, Agent

app = Flask(__name__)
asgi_app = WsgiToAsgi(app)
cors = CORS(app, resources={r"/*/*": {"origins": "*"}}) # allow CORS for all domains on all routes.
app.config['CORS_HEADERS'] = 'Content-Type'

def get_db():
    if 'db' not in g:
        db = 'file::memory:?cache=shared' if app.testing else 'db/workflows.db'
        g.db = sqlite3.connect(db)
        with current_app.open_resource("schema.sql") as f:
            g.db.executescript(f.read().decode("utf8"))
    return g.db

@app.route("/cmd", methods=['POST'])
def cmd():
    data = request.get_json()
    command = data['cmd']
    agent_id = data.get('agent_id', 0)
    ip = get_other_ip_or_none(agent_id)
    with get_db() as conn:
        conn.row_factory = sqlite3.Row  # Helps fetch rows as dictionaries
        c = conn.cursor()
        c.execute('''SELECT a.sudo_password AS sudo
                                FROM agents a
                                WHERE a.id = ?;''', (agent_id,))
        result = c.fetchone()
        sudo = result['sudo'] if result else None

    data['sudo'] = sudo
    if ip is not None and ip != '':
        print("Delegating to agent")
        return requests.post("http://%s:8000/cmd" % ip, json=data).json()
    else:
        print("Executing locally")
        return execute_command(command, sudo)

@app.route("/data", methods=['GET'], endpoint='get_data')
def get_data():
    with get_db() as conn:
        conn.row_factory = sqlite3.Row
        c = conn.cursor()

        c.execute('''
        SELECT
            s.id AS settings_id,
            json_group_array(
                json_object(
                    'id', a.id,
                    'sudoPassword', a.sudo_password,
                    'main', a.main,
                    'nickname', a.nickname,
                    'ip', a.ip,
                    'os', a.os,
                    'shell', a.shell,
                    'username', a.username,
                    'workflows', (
                        SELECT json_group_array(
                            json_object(
                                'title', w.title,
                                'cards', (
                                    SELECT json_group_array(
                                        json_object(
                                            'cardIndex', c.card_index,
                                            'script', c.script
                                        )
                                    )
                                    FROM cards c
                                    WHERE c.workflow_title = w.title
                                )
                            )
                        )
                        FROM workflows w
                        WHERE w.agent_id = a.id
                    )
                )
            ) AS agents
        FROM settings s
        LEFT JOIN agents a ON a.settings_id = s.id
        GROUP BY s.id;
        ''')

        row = c.fetchone()

    if not row:
        return jsonify({"settingsId": 0, "agents": []})

    response = {
        "settingsId": row["settings_id"],
        "agents": json.loads(row["agents"]) if row["agents"] else []  # Deserialize JSON array
    }

    return jsonify(response)


def get_other_ip_or_none(agent_id):
    try:
        with get_db() as conn:
            conn.row_factory = sqlite3.Row  # Helps fetch rows as dictionaries
            c = conn.cursor()
            c.execute('''SELECT a.ip AS ip
                            FROM agents a
                            WHERE a.id = ?;''', (agent_id,))
            agent_ip = c.fetchone()['ip']
            this_ip = get_ip()
            return agent_ip if agent_ip != this_ip else None
    except Exception as e:
        print("Error executing command: %s. %s" % (cmd, e))
        return None


@app.route("/persist/data", methods=['POST'], endpoint='persist_data')
def persist_data():
    data = request.get_json()
    print("Data: %s" % data)

    with get_db() as c:
        # Update settings table
        c.execute('INSERT OR REPLACE INTO settings (id) VALUES (?)', (1,))

        # Update agents table
        for agent in data.get('agents', []):
            c.execute('INSERT OR REPLACE INTO agents '
                      '(id, ip, settings_id, sudo_password, main, nickname, os, shell, username) VALUES '
                      '(?, ?, ?, ?, ?, ?, ?, ?, ?)',
                      (
                          agent.get('id'),
                          agent.get('ip', None),
                          1,
                          agent.get('sudoPassword'),
                          agent.get('main', agent['id'] == 0),
                          agent.get('nickname', None),
                          agent.get('os', None),
                          agent.get('shell', None),
                          agent.get('username', None)))

            # Update workflows table
            for workflow in agent.get('workflows', []):
                c.execute('INSERT OR REPLACE INTO workflows (agent_id, title) VALUES (?, ?)',
                          (agent.get('id'), workflow.get('title')))

                # Update cards table
                for idx, card in enumerate(workflow.get('cards', [])):
                    c.execute('INSERT OR REPLACE INTO cards (workflow_title, card_index, script) VALUES (?, ?, ?)',
                              (workflow.get('title'), idx, card.get('script')))

        c.commit()

    return "OK"