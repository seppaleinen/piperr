import json
import sqlite3
import subprocess

from asgiref.wsgi import WsgiToAsgi
from flask import Flask, request, jsonify, g, current_app
from flask_cors import CORS

app = Flask(__name__)
asgi_app = WsgiToAsgi(app)
cors = CORS(app, resources={r"/*/*": {"origins": "*"}}) # allow CORS for all domains on all routes.
app.config['CORS_HEADERS'] = 'Content-Type'

def get_db():
    if 'db' not in g:
        db = 'file::memory:?cache=shared' if app.testing == True else 'workflows.db'
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

@app.route("/workflows", methods=['GET'], endpoint='get_workflows')
def get_workflows():
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
            GROUP BY w.title;
        ''')

        workflows = c.fetchall()

    response = []
    for row in workflows:
        response.append({
            "title": row["title"],
            "cards": json.loads(row["cards"]) if row["cards"] else []  # Deserialize JSON string
        })

    return jsonify(response)  # Convert to a Flask JSON response

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
                        'ip', a.ip,
                        'sudo_password', a.sudo_password
                    )
                ) AS agents
            FROM settings s
            LEFT OUTER JOIN agents a ON a.settings_id = s.id
            GROUP BY s.id;
        ''')

        workflows = c.fetchall()

    response = []
    for row in workflows:
        response.append({
            "id": row["id"],
            "agents": json.loads(row["agents"]) if row["agents"] else []  # Deserialize JSON string
        })

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
        c.execute('INSERT OR REPLACE INTO workflows (title) VALUES (?)', (workflow.get('title'),))
        for idx, card in enumerate(workflow.get('cards')):
            c.execute('INSERT OR REPLACE INTO cards (workflow_title, card_index, script) VALUES (?, ?, ?)',
                      (workflow.get('title'), idx, card.get('script')))
    c.commit()
    return "OK"

@app.route("/persist/settings", methods=['POST'], endpoint='persist_settings')
def persist_settings():
    data = request.get_json()
    with get_db() as c:
        if 'settings_id' not in data:
            c.execute('INSERT OR REPLACE INTO settings (id) VALUES (?)', (1,))
        for agent in data.get('agents', []):
            c.execute('INSERT OR REPLACE INTO agents (ip, settings_id, sudo_password) VALUES (?, ?, ?)',
                      (agent.get('ip'), 1, agent.get('sudo_password')))
        c.commit()
    return "OK"
