import json
import subprocess
from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin
from asgiref.wsgi import WsgiToAsgi
import sqlite3

app = Flask(__name__)
asgi_app = WsgiToAsgi(app)
cors = CORS(app, resources={r"/*/*": {"origins": "*"}}) # allow CORS for all domains on all routes.
app.config['CORS_HEADERS'] = 'Content-Type'

db = 'workflows.db'

def create_database():
    conn = sqlite3.connect(db)
    c = conn.cursor()
    c.execute('''CREATE TABLE IF NOT EXISTS workflows (title TEXT PRIMARY KEY)''')
    c.execute('''CREATE TABLE IF NOT EXISTS cards ( workflow_title TEXT NOT NULL REFERENCES workflows(title), card_index INTEGER NOT NULL, script TEXT, constraint card_pk PRIMARY KEY (workflow_title, card_index)) ''')
    conn.commit()
    conn.close()

create_database()

@app.route("/")
def hello_world():
    return "<p>Hello, World!</p>"

@app.route("/cmd", methods=['POST'])
def cmd():
    data = request.get_json()
    try:
        return subprocess.check_output([data['cmd']], shell=True)
    except subprocess.CalledProcessError as e:
        return e.output

@app.route("/workflows", methods=['GET'], endpoint='get_workflows')
def get_workflows():
    conn = sqlite3.connect(db)
    conn.row_factory = sqlite3.Row  # Helps fetch rows as dictionaries
    c = conn.cursor()

    # Query without JSON encoding in SQLite
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
    conn.close()

    response = []
    for row in workflows:
        response.append({
            "title": row["title"],
            "cards": json.loads(row["cards"]) if row["cards"] else []  # Deserialize JSON string
        })

    return jsonify(response)  # Convert to a Flask JSON response

@app.route("/persist", methods=['POST'], endpoint='persist_workflows')
def persist_workflows():
    data = request.get_json()
    conn = sqlite3.connect(db)
    c = conn.cursor()
    c.execute('DELETE FROM workflows')
    c.execute('DELETE FROM cards')
    for workflow in data['workflows']:
        c.execute('INSERT OR REPLACE INTO workflows (title) VALUES (?)', (workflow.get('title'),))
        for idx, card in enumerate(workflow['cards']):
            c.execute('INSERT OR REPLACE INTO cards (workflow_title, card_index, script) VALUES (?, ?, ?)', (workflow['title'], idx, card['script']))
    conn.commit()
    conn.close()
    return "OK"
