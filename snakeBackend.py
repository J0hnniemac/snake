import os
from flask import Flask, request, send_from_directory
import config
import fixIndexHTML
from flask_cors import CORS

fixIndexHTML.fixIndexHTMLdoc()

app = Flask(__name__)
app.config.from_object(config)
CORS(app)
highscore = 25

@app.route("/", methods=['GET'])
def dev():
    if request.args:
        # print(request.args)
        key = list(request.args)[0]
        return send_from_directory(f"{os.getcwd()}/app/dist/snake", key)
    else:
        return send_from_directory(f"{os.getcwd()}/app/dist/snake", "index.html")

@app.route("/highscore")
def gethighscore():
    return f"{highscore}"
    #return jsonify ({"highscore":f"{highscore}"})

@app.route('/sethighscore/<userhighscore>')
def sethighscore(userhighscore):
    global highscore
    newhs = int(userhighscore)
    if newhs>highscore:
        highscore=newhs
    return gethighscore()


# ======================================
if __name__ == '__main__':
    print('Angular frontend enabled on localhost port 8080')
    app.run(debug=True, host='0.0.0.0', port=8080)
