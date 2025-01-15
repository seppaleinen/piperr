from asgiref.wsgi import WsgiToAsgi
from flask import Flask, request
from flask_cors import CORS

from server.common import execute_command

app = Flask(__name__)
asgi_app = WsgiToAsgi(app)
cors = CORS(app, resources={r"/*/*": {"origins": "*"}}) # allow CORS for all domains on all routes.
app.config['CORS_HEADERS'] = 'Content-Type'


@app.route("/cmd", methods=['POST'])
def cmd():
    data = request.get_json()
    command = data['cmd']
    sudo = data['sudo']
    return execute_command(command, sudo)


