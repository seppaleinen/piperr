import subprocess
from flask import Flask, request
from flask_cors import CORS, cross_origin

app = Flask(__name__)
cors = CORS(app) # allow CORS for all domains on all routes.
app.config['CORS_HEADERS'] = 'Content-Type'

@app.route("/")
def hello_world():
    return "<p>Hello, World!</p>"

@app.route("/cmd", methods=['POST'])
@cross_origin()
def cmd():
    data = request.get_json()
    try:
        return subprocess.check_output([data['cmd']], shell=True)
    except subprocess.CalledProcessError as e:
        return e.output