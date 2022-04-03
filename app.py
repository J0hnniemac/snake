from flask import Flask
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

highscore = 10
@app.route("/")
def hello_world():
    return "<p>Hello, World!</p>"

@app.route("/highscore")
def gethighscore():
    return f"{highscore}"

@app.route('/sethighscore/<userhighscore>')
def sethighscore(userhighscore):
    global highscore
    newhs = int(userhighscore)
    if newhs>highscore:
        highscore=newhs
    return gethighscore()