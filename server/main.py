import json
import socket
import sqlite3
import subprocess

from asgiref.wsgi import WsgiToAsgi
from flask import Flask, request, jsonify, g, current_app
from flask_cors import CORS

app = Flask(__name__)
asgi_app = WsgiToAsgi(app)
cors = CORS(app, resources={r"/*/*": {"origins": "*"}}) # allow CORS for all domains on all routes.
app.config['CORS_HEADERS'] = 'Content-Type'

def get_ip():
    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    s.settimeout(0)
    try:
        # doesn't even have to be reachable
        s.connect(('10.254.254.254', 1))
        ip = s.getsockname()[0]
    except Exception:
        ip = '127.0.0.1'
    finally:
        s.close()
    return ip

def get_db():
    if 'db' not in g:
        db = 'file::memory:?cache=shared' if app.testing else 'workflows.db'
        g.db = sqlite3.connect(db)
        with current_app.open_resource("schema.sql") as f:
            g.db.executescript(f.read().decode("utf8"))
    return g.db

@app.route("/cmd", methods=['POST'])
def cmd():
    data = request.get_json()
    try:
        return subprocess.check_output([data['cmd']], shell=True)
    except subprocess.CalledProcessError as e:
        return e.output

@app.route("/workflows/<agent_id>", methods=['GET'], endpoint='get_workflows')
def get_workflows(agent_id):
    with get_db() as conn:
        conn.row_factory = sqlite3.Row  # Helps fetch rows as dictionaries
        c = conn.cursor()
        c.execute('''
        SELECT
            w.title AS title,
            json_group_array(
                json_object(
                    'card_index', c.card_index,
                    'script', c.script
                )
            ) AS cards
                FROM workflows w
                LEFT OUTER JOIN cards c ON c.workflow_title = w.title
                WHERE w.agent_id = ?
                GROUP BY w.title;
                 ''', (int(agent_id),))

        workflows = c.fetchall()

    response = []
    for row in workflows:
        response.append({
            "title": row["title"],
            "cards": json.loads(row["cards"]) if row["cards"] else []  # Deserialize JSON string
        })

    return jsonify(response)  # Convert to a Flask JSON response


def execute_command(command):
    try:
        return subprocess.check_output([command])
    except subprocess.CalledProcessError as e:
        print("Error executing command: %s. %s" % (cmd, e))
        return None


@app.route("/settings", methods=['GET'], endpoint='get_settings')
def get_settings():
    with get_db() as conn:
        conn.row_factory = sqlite3.Row  # Helps fetch rows as dictionaries
        c = conn.cursor()
        c.execute('''
            SELECT 
                s.id,
                json_group_array(
                    json_object(
                        'id', a.id,
                        'sudo_password', a.sudo_password,
                        'main', a.main,
                        'ip', a.ip,
                        'nickname', a.nickname,
                        'os', a.os,
                        'shell', a.shell,
                        'username', a.username
                    )
                ) AS agents
            FROM settings s
            INNER JOIN agents a ON a.settings_id = s.id
            GROUP BY s.id;
        ''')

        workflows = c.fetchall()

    response = {}
    for row in workflows:
        response['id'] = row["id"]
        for a in json.loads(row["agents"]):
            agent = {'ip': a.get('ip') if a.get('ip') else get_ip(),
                     'sudo_password': a.get('sudo_password'),
                     'id': a.get('id'),
                     'main': a.get('main', False),
                     'nickname': a.get('nickname', ''),
                     'os': a.get('os') if a.get('os') else execute_command("uname -o").strip().decode("utf-8"),
                     'shell': a.get('shell') if a.get('shell') else execute_command("echo $SHELL").strip().decode("utf-8"),
                     'username': a.get('username') if a.get('username') else execute_command("whoami").strip().decode("utf-8"),
                     }
            print("Agent: %s" % agent)
            response['agents'] = response.get('agents', []) + [agent]

    return jsonify(response)  # Convert to a Flask JSON response

@app.route("/persist/workflows", methods=['POST'], endpoint='persist_workflows')
def persist_workflows():
    data = request.get_json()
    if not data:
        return {"error": "Invalid payload"}, 400

    c = get_db()
    c.execute('DELETE FROM workflows')
    c.execute('DELETE FROM cards')
    for workflow in list(data):
        c.execute('INSERT OR REPLACE INTO workflows (agent_id, title) VALUES (?, ?)',
                  (workflow.get('agent').get('id'), workflow.get('title'),))
        for idx, card in enumerate(workflow.get('cards')):
            c.execute('INSERT OR REPLACE INTO cards (workflow_title, card_index, script) VALUES (?, ?, ?)',
                      (workflow.get('title'), idx, card.get('script')))
    c.commit()
    return "OK"

@app.route("/persist/settings", methods=['POST'], endpoint='persist_settings')
def persist_settings():
    data = request.get_json()
    with get_db() as c:
        c.execute('INSERT OR REPLACE INTO settings (id) VALUES (?)', (1,))
        for agent in data.get('agents', []):
            c.execute('INSERT OR REPLACE INTO agents '
                      '(id, ip, settings_id, sudo_password, main, nickname, os, shell, username) VALUES '
                      '(?, ?, ?, ?, ?, ?, ?, ?, ?)',
                      (
                            agent.get('id'),
                            agent.get('ip', None),
                            1,
                            agent.get('sudo_password'),
                            agent.get('main', agent['id'] == 0),
                            agent.get('nickname', None),
                            agent.get('os', None),
                            agent.get('shell', None),
                            agent.get('username', None)))
        c.commit()
    return "OK"
